-- Tabell for personer (familie/venner)
CREATE TABLE IF NOT EXISTS people (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT, -- f.eks. "sønn", "mor", "venn"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabell for gaver (både gitt og ideer)
CREATE TABLE IF NOT EXISTS gifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  occasion TEXT NOT NULL, -- 'jul', 'bursdag', 'annet'
  occasion_custom TEXT, -- brukes når occasion er 'annet'
  year INTEGER NOT NULL,
  is_idea BOOLEAN DEFAULT false, -- true = idé, false = gitt gave
  given_date DATE, -- når gaven ble gitt (null hvis idé)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indekser for raskere søk
CREATE INDEX IF NOT EXISTS idx_people_user_id ON people(user_id);
CREATE INDEX IF NOT EXISTS idx_gifts_user_id ON gifts(user_id);
CREATE INDEX IF NOT EXISTS idx_gifts_person_id ON gifts(person_id);
CREATE INDEX IF NOT EXISTS idx_gifts_occasion_year ON gifts(occasion, year);
