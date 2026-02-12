-- ============================================================
-- Viztok Initial Schema
-- Tables: profiles, agents, videos, user_interactions, watchlist
-- ============================================================

-- 1. PROFILES
-- Extends Supabase auth.users with app-specific fields
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  role text not null default 'viewer' check (role in ('viewer', 'director', 'admin')),
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone authenticated can read profiles
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can only update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();


-- 2. AGENTS
-- AI director accounts that create content
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles on delete cascade,
  agent_name text not null unique,
  description text,
  total_views bigint not null default 0,
  total_videos int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.agents enable row level security;

-- Anyone authenticated can read agents
create policy "Agents are viewable by authenticated users"
  on public.agents for select
  to authenticated
  using (true);

-- Only the owning profile can create an agent
create policy "Users can create their own agent"
  on public.agents for insert
  to authenticated
  with check (auth.uid() = profile_id);

-- Only the owning profile can update their agent
create policy "Users can update their own agent"
  on public.agents for update
  to authenticated
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);


-- 3. VIDEOS
-- All uploaded content (episodes, films)
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents on delete cascade,
  title text not null,
  description text,
  genre text,
  duration_seconds int,
  video_url text,
  thumbnail_url text,
  ai_rating numeric(3,1) check (ai_rating >= 0 and ai_rating <= 10),
  view_count bigint not null default 0,
  status text not null default 'processing' check (status in ('processing', 'published', 'removed')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.videos enable row level security;

-- Anyone authenticated can read published videos
create policy "Published videos are viewable by authenticated users"
  on public.videos for select
  to authenticated
  using (status = 'published');

-- Agent owners can see all their own videos (any status)
create policy "Agent owners can view all their videos"
  on public.videos for select
  to authenticated
  using (
    agent_id in (
      select id from public.agents where profile_id = auth.uid()
    )
  );

-- Agent owners can insert videos
create policy "Agent owners can insert videos"
  on public.videos for insert
  to authenticated
  with check (
    agent_id in (
      select id from public.agents where profile_id = auth.uid()
    )
  );

-- Agent owners can update their own videos
create policy "Agent owners can update their videos"
  on public.videos for update
  to authenticated
  using (
    agent_id in (
      select id from public.agents where profile_id = auth.uid()
    )
  )
  with check (
    agent_id in (
      select id from public.agents where profile_id = auth.uid()
    )
  );

create trigger videos_updated_at
  before update on public.videos
  for each row execute function public.handle_updated_at();


-- 4. USER_INTERACTIONS
-- Likes, dislikes, ratings, view history
create table public.user_interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  video_id uuid not null references public.videos on delete cascade,
  interaction_type text not null check (interaction_type in ('like', 'dislike', 'rating', 'view')),
  rating_value smallint check (rating_value >= 1 and rating_value <= 10),
  created_at timestamptz not null default now(),
  unique (user_id, video_id, interaction_type)
);

alter table public.user_interactions enable row level security;

-- Users can read their own interactions
create policy "Users can view their own interactions"
  on public.user_interactions for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own interactions
create policy "Users can insert their own interactions"
  on public.user_interactions for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can delete their own interactions (unlike, remove rating)
create policy "Users can delete their own interactions"
  on public.user_interactions for delete
  to authenticated
  using (auth.uid() = user_id);


-- 5. WATCHLIST
-- User's saved/bookmarked videos
create table public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  video_id uuid not null references public.videos on delete cascade,
  added_at timestamptz not null default now(),
  unique (user_id, video_id)
);

alter table public.watchlist enable row level security;

-- Users can read their own watchlist
create policy "Users can view their own watchlist"
  on public.watchlist for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can add to their own watchlist
create policy "Users can add to their own watchlist"
  on public.watchlist for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can remove from their own watchlist
create policy "Users can remove from their own watchlist"
  on public.watchlist for delete
  to authenticated
  using (auth.uid() = user_id);


-- ============================================================
-- INDEXES
-- ============================================================

-- Videos indexes
create index idx_videos_genre on public.videos (genre);
create index idx_videos_agent_id on public.videos (agent_id);
create index idx_videos_status_published on public.videos (status, published_at desc);
create index idx_videos_ai_rating on public.videos (ai_rating desc);

-- User interactions indexes
create index idx_user_interactions_user_id on public.user_interactions (user_id);
create index idx_user_interactions_video_id on public.user_interactions (video_id);

-- Watchlist indexes
create index idx_watchlist_user_id on public.watchlist (user_id);
