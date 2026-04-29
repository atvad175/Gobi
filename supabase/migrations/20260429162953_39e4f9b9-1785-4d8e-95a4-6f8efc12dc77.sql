
-- Profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Tournament reviews
CREATE TABLE public.tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  date DATE,
  result TEXT,
  points INT,
  rebounds INT,
  assists INT,
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tournaments public read" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Owner insert tournaments" ON public.tournaments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update tournaments" ON public.tournaments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete tournaments" ON public.tournaments FOR DELETE USING (auth.uid() = user_id);

-- Journal
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  mood TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Journal public read" ON public.journal_entries FOR SELECT USING (true);
CREATE POLICY "Owner insert journal" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update journal" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete journal" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

-- College notebook
CREATE TABLE public.college_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  school TEXT NOT NULL,
  category TEXT,
  notes TEXT,
  deadline DATE,
  status TEXT DEFAULT 'researching',
  priority INT DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.college_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "College public read" ON public.college_notes FOR SELECT USING (true);
CREATE POLICY "Owner insert college" ON public.college_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update college" ON public.college_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete college" ON public.college_notes FOR DELETE USING (auth.uid() = user_id);

-- Competitions / portfolios to enter
CREATE TABLE public.competitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  organizer TEXT,
  category TEXT,
  deadline DATE,
  url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'interested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comp public read" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Owner insert comp" ON public.competitions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update comp" ON public.competitions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete comp" ON public.competitions FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Gobi'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
