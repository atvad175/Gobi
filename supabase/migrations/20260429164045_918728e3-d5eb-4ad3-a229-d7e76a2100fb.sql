CREATE TABLE public.training_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  focus TEXT NOT NULL,
  duration_min INTEGER,
  intensity INTEGER DEFAULT 3,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.training_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Training public read" ON public.training_logs FOR SELECT USING (true);
CREATE POLICY "Owner insert training" ON public.training_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update training" ON public.training_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete training" ON public.training_logs FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_training_logs_date ON public.training_logs(log_date DESC);


CREATE TABLE public.highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  kind TEXT NOT NULL DEFAULT 'quote',
  title TEXT NOT NULL,
  body TEXT,
  url TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Highlights public read" ON public.highlights FOR SELECT USING (true);
CREATE POLICY "Owner insert highlights" ON public.highlights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update highlights" ON public.highlights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete highlights" ON public.highlights FOR DELETE USING (auth.uid() = user_id);