-- =====================================================
-- MULTI-SPORT EVENT REGISTRATION PLATFORM
-- Backend Architecture Enhancement
-- High Concurrency | Zero Duplicates | Live Tracking
-- =====================================================

-- Create additional enums
CREATE TYPE public.registration_status AS ENUM ('pending', 'confirmed', 'cancelled', 'checked_in');
CREATE TYPE public.notification_type AS ENUM ('registration_success', 'event_reminder', 'event_cancelled', 'slot_alert', 'admin_announcement');
CREATE TYPE public.audit_action AS ENUM ('create', 'update', 'delete', 'check_in', 'cancel');

-- =====================================================
-- TEAMS TABLE (Separate from Registrations)
-- =====================================================
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, team_name)
);

-- =====================================================
-- CHECK-INS TABLE (QR Code Scanning)
-- =====================================================
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  checked_in_by UUID REFERENCES public.profiles(id),
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location TEXT,
  notes TEXT,
  UNIQUE(registration_id)
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- AUDIT LOG TABLE (Track All Changes)
-- =====================================================
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action public.audit_action NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES public.profiles(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Events indexes
CREATE INDEX idx_events_sport_id ON public.events(sport_id);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_events_available_slots ON public.events(available_slots) WHERE available_slots > 0;

-- Registrations indexes
CREATE INDEX idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX idx_registrations_user_id ON public.registrations(user_id);
CREATE INDEX idx_registrations_status ON public.registrations(status);
CREATE INDEX idx_registrations_created_at ON public.registrations(created_at DESC);

-- Teams indexes
CREATE INDEX idx_teams_event_id ON public.teams(event_id);
CREATE INDEX idx_teams_captain_id ON public.teams(captain_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read) WHERE read = false;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Audit log indexes
CREATE INDEX idx_audit_log_table_record ON public.audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- Profiles indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- =====================================================
-- REGISTRATION ENGINE (Atomic, Safe, Zero Duplicates)
-- =====================================================

CREATE OR REPLACE FUNCTION register_for_event(
  p_event_id UUID,
  p_user_id UUID,
  p_registration_type public.registration_type,
  p_team_name TEXT DEFAULT NULL,
  p_team_members JSONB DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  registration_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event RECORD;
  v_existing_registration UUID;
  v_registration_id UUID;
  v_qr_data TEXT;
  v_team_id UUID;
BEGIN
  -- Step 1: Lock the event row for update (prevents race conditions)
  SELECT * INTO v_event
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE;

  -- Step 2: Validate event exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Event not found', NULL::UUID;
    RETURN;
  END IF;

  -- Step 3: Check event is open
  IF v_event.status != 'upcoming' THEN
    RETURN QUERY SELECT false, 'Event is not open for registration', NULL::UUID;
    RETURN;
  END IF;

  -- Step 4: Check registration deadline
  IF v_event.event_date < CURRENT_DATE THEN
    RETURN QUERY SELECT false, 'Registration deadline has passed', NULL::UUID;
    RETURN;
  END IF;

  -- Step 5: Check slots available
  IF v_event.available_slots <= 0 THEN
    RETURN QUERY SELECT false, 'No slots available', NULL::UUID;
    RETURN;
  END IF;

  -- Step 6: Check for duplicate registration
  SELECT id INTO v_existing_registration
  FROM public.registrations
  WHERE event_id = p_event_id AND user_id = p_user_id;

  IF FOUND THEN
    RETURN QUERY SELECT false, 'Already registered for this event', NULL::UUID;
    RETURN;
  END IF;

  -- Step 7: Validate registration type matches event
  IF v_event.registration_type != p_registration_type THEN
    RETURN QUERY SELECT false, 'Invalid registration type for this event', NULL::UUID;
    RETURN;
  END IF;

  -- Step 8: Team validation (if team event)
  IF p_registration_type = 'team' THEN
    IF p_team_name IS NULL OR p_team_members IS NULL THEN
      RETURN QUERY SELECT false, 'Team name and members required', NULL::UUID;
      RETURN;
    END IF;

    -- Validate team size
    IF jsonb_array_length(p_team_members) != v_event.team_size THEN
      RETURN QUERY SELECT false, 
        format('Team must have exactly %s members', v_event.team_size), 
        NULL::UUID;
      RETURN;
    END IF;

    -- Create team
    INSERT INTO public.teams (event_id, team_name, captain_id, team_size)
    VALUES (p_event_id, p_team_name, p_user_id, v_event.team_size)
    RETURNING id INTO v_team_id;
  END IF;

  -- Step 9: Generate QR code data
  v_qr_data := encode(
    digest(
      p_event_id::text || p_user_id::text || NOW()::text,
      'sha256'
    ),
    'hex'
  );

  -- Step 10: Create registration
  INSERT INTO public.registrations (
    event_id,
    user_id,
    registration_type,
    team_name,
    status,
    qr_code_data
  )
  VALUES (
    p_event_id,
    p_user_id,
    p_registration_type,
    p_team_name,
    'confirmed',
    v_qr_data
  )
  RETURNING id INTO v_registration_id;

  -- Step 11: Insert team members (if team event)
  IF p_registration_type = 'team' AND p_team_members IS NOT NULL THEN
    INSERT INTO public.team_members (
      registration_id,
      member_name,
      member_email,
      member_phone,
      position
    )
    SELECT
      v_registration_id,
      (member->>'member_name')::TEXT,
      (member->>'member_email')::TEXT,
      (member->>'member_phone')::TEXT,
      (member->>'position')::TEXT
    FROM jsonb_array_elements(p_team_members) AS member;
  END IF;

  -- Step 12: Decrement available slots (ATOMIC)
  UPDATE public.events
  SET 
    available_slots = available_slots - 1,
    updated_at = NOW()
  WHERE id = p_event_id;

  -- Step 13: Create notification
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    event_id
  )
  VALUES (
    p_user_id,
    'registration_success',
    'Registration Successful',
    format('You have successfully registered for %s', v_event.title),
    p_event_id
  );

  -- Step 14: Audit log
  INSERT INTO public.audit_log (
    table_name,
    record_id,
    action,
    new_data,
    user_id
  )
  VALUES (
    'registrations',
    v_registration_id,
    'create',
    jsonb_build_object(
      'event_id', p_event_id,
      'user_id', p_user_id,
      'registration_type', p_registration_type
    ),
    p_user_id
  );

  -- Success!
  RETURN QUERY SELECT true, 'Registration successful', v_registration_id;
END;
$$;

-- =====================================================
-- CHECK-IN FUNCTION (QR Code Scanning)
-- =====================================================

CREATE OR REPLACE FUNCTION check_in_registration(
  p_qr_code_data TEXT,
  p_checked_in_by UUID,
  p_location TEXT DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  registration_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_registration RECORD;
  v_existing_checkin UUID;
BEGIN
  -- Find registration by QR code
  SELECT r.*, e.title as event_title, p.username
  INTO v_registration
  FROM public.registrations r
  JOIN public.events e ON e.id = r.event_id
  JOIN public.profiles p ON p.id = r.user_id
  WHERE r.qr_code_data = p_qr_code_data;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Invalid QR code', NULL::JSONB;
    RETURN;
  END IF;

  -- Check if already checked in
  SELECT id INTO v_existing_checkin
  FROM public.check_ins
  WHERE registration_id = v_registration.id;

  IF FOUND THEN
    RETURN QUERY SELECT false, 'Already checked in', NULL::JSONB;
    RETURN;
  END IF;

  -- Create check-in record
  INSERT INTO public.check_ins (
    registration_id,
    checked_in_by,
    location
  )
  VALUES (
    v_registration.id,
    p_checked_in_by,
    p_location
  );

  -- Update registration status
  UPDATE public.registrations
  SET status = 'confirmed'
  WHERE id = v_registration.id;

  -- Audit log
  INSERT INTO public.audit_log (
    table_name,
    record_id,
    action,
    new_data,
    user_id
  )
  VALUES (
    'check_ins',
    v_registration.id,
    'check_in',
    jsonb_build_object(
      'registration_id', v_registration.id,
      'checked_in_by', p_checked_in_by
    ),
    p_checked_in_by
  );

  -- Return success with registration data
  RETURN QUERY SELECT 
    true, 
    'Check-in successful',
    jsonb_build_object(
      'registration_id', v_registration.id,
      'user_name', v_registration.username,
      'event_title', v_registration.event_title,
      'registration_type', v_registration.registration_type,
      'team_name', v_registration.team_name
    );
END;
$$;

-- =====================================================
-- CANCEL REGISTRATION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION cancel_registration(
  p_registration_id UUID,
  p_user_id UUID
)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_registration RECORD;
  v_is_admin BOOLEAN;
BEGIN
  -- Check if user is admin
  v_is_admin := is_admin(p_user_id);

  -- Get registration with lock
  SELECT r.*, e.event_date
  INTO v_registration
  FROM public.registrations r
  JOIN public.events e ON e.id = r.event_id
  WHERE r.id = p_registration_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Registration not found';
    RETURN;
  END IF;

  -- Check ownership (unless admin)
  IF NOT v_is_admin AND v_registration.user_id != p_user_id THEN
    RETURN QUERY SELECT false, 'Unauthorized';
    RETURN;
  END IF;

  -- Check if event has passed
  IF v_registration.event_date < CURRENT_DATE THEN
    RETURN QUERY SELECT false, 'Cannot cancel past event';
    RETURN;
  END IF;

  -- Update registration status
  UPDATE public.registrations
  SET status = 'cancelled'
  WHERE id = p_registration_id;

  -- Increment available slots
  UPDATE public.events
  SET 
    available_slots = available_slots + 1,
    updated_at = NOW()
  WHERE id = v_registration.event_id;

  -- Audit log
  INSERT INTO public.audit_log (
    table_name,
    record_id,
    action,
    old_data,
    user_id
  )
  VALUES (
    'registrations',
    p_registration_id,
    'cancel',
    jsonb_build_object('status', v_registration.status),
    p_user_id
  );

  RETURN QUERY SELECT true, 'Registration cancelled successfully';
END;
$$;

-- =====================================================
-- GET REGISTRATION STATISTICS
-- =====================================================

CREATE OR REPLACE FUNCTION get_registration_stats()
RETURNS TABLE(
  total_events INTEGER,
  total_registrations INTEGER,
  total_users INTEGER,
  upcoming_events INTEGER,
  available_slots INTEGER,
  registrations_today INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM public.events),
    (SELECT COUNT(*)::INTEGER FROM public.registrations WHERE status = 'confirmed'),
    (SELECT COUNT(*)::INTEGER FROM public.profiles WHERE role = 'user'),
    (SELECT COUNT(*)::INTEGER FROM public.events WHERE status = 'upcoming'),
    (SELECT COALESCE(SUM(available_slots), 0)::INTEGER FROM public.events WHERE status = 'upcoming'),
    (SELECT COUNT(*)::INTEGER FROM public.registrations WHERE DATE(created_at) = CURRENT_DATE);
END;
$$;

-- =====================================================
-- ENABLE RLS ON NEW TABLES
-- =====================================================

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR NEW TABLES
-- =====================================================

-- Teams policies
CREATE POLICY "Anyone can view teams" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Captains can create teams" ON teams
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = captain_id);

CREATE POLICY "Admins can manage teams" ON teams
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Check-ins policies
CREATE POLICY "Users can view their check-ins" ON check_ins
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM registrations r
      WHERE r.id = check_ins.registration_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage check-ins" ON check_ins
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Audit log policies (admin only)
CREATE POLICY "Admins can view audit log" ON audit_log
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- =====================================================
-- TRIGGER: Update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- GRANT EXECUTE PERMISSIONS
-- =====================================================

GRANT EXECUTE ON FUNCTION register_for_event TO authenticated;
GRANT EXECUTE ON FUNCTION check_in_registration TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_registration TO authenticated;
GRANT EXECUTE ON FUNCTION get_registration_stats TO authenticated;