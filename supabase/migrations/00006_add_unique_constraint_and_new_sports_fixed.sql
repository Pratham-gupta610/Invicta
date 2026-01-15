-- Step 1: Add unique constraint to prevent duplicate registrations
-- This ensures a user can only register once per event
ALTER TABLE registrations 
ADD CONSTRAINT unique_user_event_registration 
UNIQUE (user_id, event_id);

-- Step 2: Add three new sports
INSERT INTO sports (name, slug, description, rules) VALUES
(
  'Dodgeball',
  'dodgeball',
  'Dodgeball is a fast-paced team sport where players throw balls at opponents while avoiding being hit. It requires quick reflexes, agility, and strategic teamwork. Players must dodge, duck, and catch to eliminate opponents and protect teammates. The game combines physical fitness with tactical thinking. It is an exciting and energetic sport suitable for all skill levels.',
  'Dodgeball is a fast-paced team sport where players throw balls at opponents while avoiding being hit. It requires quick reflexes, agility, and strategic teamwork. Players must dodge, duck, and catch to eliminate opponents and protect teammates. The game combines physical fitness with tactical thinking. It is an exciting and energetic sport suitable for all skill levels.'
),
(
  'Kabaddi',
  'kabaddi',
  'Kabaddi is a traditional contact team sport that combines elements of wrestling and tag. A raider enters the opponent''s half, tags defenders, and returns without being tackled. It requires strength, speed, strategy, and breath control. The sport demands both offensive and defensive skills. Kabaddi is one of the most popular indigenous sports in South Asia.',
  'Kabaddi is a traditional contact team sport that combines elements of wrestling and tag. A raider enters the opponent''s half, tags defenders, and returns without being tackled. It requires strength, speed, strategy, and breath control. The sport demands both offensive and defensive skills. Kabaddi is one of the most popular indigenous sports in South Asia.'
),
(
  'Carrom',
  'carrom',
  'Carrom is a tabletop game where players flick a striker to pocket colored pieces into corner pockets. It requires precision, finger control, and strategic planning. Players must calculate angles and apply the right amount of force. The game can be played in singles or doubles format. Carrom is a popular indoor game that combines skill with concentration.',
  'Carrom is a tabletop game where players flick a striker to pocket colored pieces into corner pockets. It requires precision, finger control, and strategic planning. Players must calculate angles and apply the right amount of force. The game can be played in singles or doubles format. Carrom is a popular indoor game that combines skill with concentration.'
)
ON CONFLICT (slug) DO NOTHING;

-- Step 3: Create index for faster duplicate checks
CREATE INDEX IF NOT EXISTS idx_registrations_user_event 
ON registrations(user_id, event_id);

-- Step 4: Add logging table for blocked duplicate attempts
CREATE TABLE IF NOT EXISTS duplicate_registration_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  event_id UUID NOT NULL REFERENCES events(id),
  attempted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Add index for logging queries
CREATE INDEX IF NOT EXISTS idx_duplicate_attempts_user 
ON duplicate_registration_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_duplicate_attempts_event 
ON duplicate_registration_attempts(event_id);