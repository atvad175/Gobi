-- Tournament photos table (gallery + MVP moment)
CREATE TABLE public.tournament_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  is_mvp_moment BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tournament_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos public read" ON public.tournament_photos FOR SELECT USING (true);
CREATE POLICY "Owner insert photos" ON public.tournament_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update photos" ON public.tournament_photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete photos" ON public.tournament_photos FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_tournament_photos_tid ON public.tournament_photos(tournament_id);

-- Add fields to tournaments for pathway + scheduling
ALTER TABLE public.tournaments
  ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'district',
  ADD COLUMN IF NOT EXISTS tip_off TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_upcoming BOOLEAN NOT NULL DEFAULT false;

-- Storage bucket for tournament photos (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('tournament-photos', 'tournament-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Tournament photos public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'tournament-photos');

CREATE POLICY "Authenticated users can upload tournament photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'tournament-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owners can update their tournament photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'tournament-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owners can delete their tournament photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'tournament-photos' AND auth.uid()::text = (storage.foldername(name))[1]);