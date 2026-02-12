-- Add Mux video columns to videos table
ALTER TABLE public.videos
  ADD COLUMN mux_asset_id text UNIQUE,
  ADD COLUMN mux_playback_id text,
  ADD COLUMN mux_upload_id text UNIQUE;
