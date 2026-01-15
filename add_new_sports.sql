-- Add three new sports: Dodgeball, Kabaddi, Carrom
-- Run this SQL in your Supabase SQL Editor

INSERT INTO sports (name, slug, description, rules, icon_name) VALUES
(
  'Dodgeball',
  'dodgeball',
  'Dodgeball is a fast-paced team sport where players throw balls at opponents while avoiding being hit. It requires quick reflexes, agility, and strategic teamwork. Players must dodge, duck, and catch to eliminate opponents and protect teammates. The game combines physical fitness with tactical thinking. It is an exciting and energetic sport suitable for all skill levels.',
  'Dodgeball is a fast-paced team sport where players throw balls at opponents while avoiding being hit. It requires quick reflexes, agility, and strategic teamwork. Players must dodge, duck, and catch to eliminate opponents and protect teammates. The game combines physical fitness with tactical thinking. It is an exciting and energetic sport suitable for all skill levels.',
  'target'
),
(
  'Kabaddi',
  'kabaddi',
  'Kabaddi is a traditional contact team sport that combines elements of wrestling and tag. A raider enters the opponent''s half, tags defenders, and returns without being tackled. It requires strength, speed, strategy, and breath control. The sport demands both offensive and defensive skills. Kabaddi is one of the most popular indigenous sports in South Asia.',
  'Kabaddi is a traditional contact team sport that combines elements of wrestling and tag. A raider enters the opponent''s half, tags defenders, and returns without being tackled. It requires strength, speed, strategy, and breath control. The sport demands both offensive and defensive skills. Kabaddi is one of the most popular indigenous sports in South Asia.',
  'users'
),
(
  'Carrom',
  'carrom',
  'Carrom is a tabletop game where players flick a striker to pocket colored pieces into corner pockets. It requires precision, finger control, and strategic planning. Players must calculate angles and apply the right amount of force. The game can be played in singles or doubles format. Carrom is a popular indoor game that combines skill with concentration.',
  'Carrom is a tabletop game where players flick a striker to pocket colored pieces into corner pockets. It requires precision, finger control, and strategic planning. Players must calculate angles and apply the right amount of force. The game can be played in singles or doubles format. Carrom is a popular indoor game that combines skill with concentration.',
  'square'
)
ON CONFLICT (slug) DO NOTHING;
