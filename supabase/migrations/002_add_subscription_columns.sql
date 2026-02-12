-- Add subscription columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN stripe_customer_id text UNIQUE,
  ADD COLUMN subscription_status text NOT NULL DEFAULT 'free',
  ADD COLUMN subscription_tier text NOT NULL DEFAULT 'free',
  ADD COLUMN subscription_period_end timestamptz;

-- Track video views for free-tier limiting
CREATE TABLE public.video_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  video_id uuid REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, video_id)
);

ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own views"
  ON public.video_views FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own views"
  ON public.video_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);
