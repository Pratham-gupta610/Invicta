-- Create user_role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create registration_type enum
CREATE TYPE public.registration_type AS ENUM ('individual', 'team');

-- Create event_status enum
CREATE TYPE public.event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'user'::public.user_role,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create sports table
CREATE TABLE public.sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  rules TEXT NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id UUID NOT NULL REFERENCES public.sports(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT NOT NULL,
  registration_type public.registration_type NOT NULL,
  total_slots INTEGER NOT NULL,
  available_slots INTEGER NOT NULL,
  team_size INTEGER,
  status public.event_status NOT NULL DEFAULT 'upcoming'::public.event_status,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registration_type public.registration_type NOT NULL,
  team_name TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  qr_code_data TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  member_email TEXT,
  member_phone TEXT,
  position TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create function to sync auth users to profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  extracted_username text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username from email (remove @miaoda.com)
  extracted_username := REPLACE(NEW.email, '@miaoda.com', '');
  
  INSERT INTO public.profiles (id, username, email, phone, role)
  VALUES (
    NEW.id,
    extracted_username,
    NEW.email,
    NEW.phone,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for user sync
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create helper function for admin check
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT TO anon USING (true);

-- Sports policies (public read, admin write)
CREATE POLICY "Anyone can view sports" ON sports
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage sports" ON sports
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Events policies (public read, admin write)
CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON events
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Registrations policies
CREATE POLICY "Users can view their own registrations" ON registrations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create registrations" ON registrations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all registrations" ON registrations
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all registrations" ON registrations
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Team members policies
CREATE POLICY "Users can view their team members" ON team_members
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM registrations r
      WHERE r.id = team_members.registration_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create team members" ON team_members
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM registrations r
      WHERE r.id = team_members.registration_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all team members" ON team_members
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- Documents policies
CREATE POLICY "Users can view their documents" ON documents
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM registrations r
      WHERE r.id = documents.registration_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload documents" ON documents
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM registrations r
      WHERE r.id = documents.registration_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all documents" ON documents
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- Insert initial sports data
INSERT INTO public.sports (name, slug, description, rules) VALUES
('Cricket', 'cricket', 'Cricket is a team-based bat and ball sport played between two teams of eleven players. It involves strategic batting, skillful bowling, and sharp fielding to score runs and take wickets. Matches can range from fast-paced short formats to longer strategic games. Team coordination, individual performance, and tactical planning play a major role. It is one of the most popular and widely followed sports in the world.', 'Standard cricket rules apply with 11 players per team. Matches follow ICC regulations with proper batting, bowling, and fielding rotations.'),
('Football', 'football', 'Football 9v9 is a fast and compact version of traditional football played on a smaller field. It focuses heavily on teamwork, passing, movement, and tactical positioning. The reduced number of players increases player involvement and intensity. Players need stamina, agility, and strong ball control to succeed. This format delivers exciting and high-scoring matches.', '9 players per team on a smaller field. Standard football rules apply with modified field dimensions. Focus on teamwork and tactical play.'),
('Basketball', 'basketball', 'Basketball is a high-energy court sport played between two teams of five players. The objective is to score points by shooting the ball through the opponent''s hoop. It requires speed, agility, teamwork, and quick decision-making. Players must be skilled in dribbling, shooting, passing, and defense. It is one of the most dynamic and fast-moving sports.', '5 players per team. Standard basketball rules with 4 quarters. Focus on scoring, defense, and teamwork.'),
('Table Tennis', 'table-tennis', 'Table tennis is a fast-paced indoor sport played with paddles and a lightweight ball. It demands excellent reflexes, hand-eye coordination, and precision. Players must control speed, spin, and placement to outplay opponents. It can be played in singles or doubles formats. The game combines physical agility with tactical thinking.', 'Singles or doubles format. Standard table tennis rules with 11-point games. Best of 5 or 7 sets.'),
('Badminton', 'badminton', 'Badminton is a racket sport played using a shuttlecock over a net. It requires quick movement, powerful smashes, and accurate shot placement. Players must have great stamina, speed, and coordination. The sport can be played in singles, doubles, or mixed doubles. It is one of the fastest racket sports in the world.', 'Singles, doubles, or mixed doubles. 21-point rally scoring system. Best of 3 games.'),
('Volleyball', 'volleyball', 'Volleyball is a team sport where players hit a ball over a net to score points. It requires strong teamwork, timing, jumping, and communication. Each team tries to ground the ball in the opponent''s court. The game involves serving, passing, setting, attacking, and blocking. It is widely played both indoors and on beaches.', '6 players per team. 25-point sets with best of 5. Standard volleyball rotation and rules apply.'),
('Athletics', 'athletics', 'Athletics includes a variety of track and field events such as running, jumping, and throwing. It tests speed, strength, endurance, and physical fitness. Events range from short sprints to long-distance races and technical field events. Athletes compete individually to achieve the best performance. It forms the foundation of many competitive sports.', 'Various track and field events. Individual competitions with standard IAAF rules. Timed races and measured field events.'),
('Chess', 'chess', 'Chess is a strategic board game played between two players. It focuses on planning, logic, foresight, and decision-making. Players aim to checkmate the opponent''s king by outsmarting them. The game requires deep concentration and analytical thinking. Chess is recognized globally as a competitive mind sport.', 'Standard chess rules with FIDE regulations. Timed matches with various time controls. Individual competition format.');
