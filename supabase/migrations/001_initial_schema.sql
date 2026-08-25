-- ══════════════════════════════════════════════════════════════
-- WALFA CHESS — Migración Inicial
-- 001_initial_schema.sql
-- ══════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- FUNCIÓN: update_updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TABLA: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'admin'
                CHECK (role IN ('admin', 'super_admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'admin'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- TABLA: players
CREATE TABLE IF NOT EXISTS players (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name     TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  birth_date    DATE,
  nationality   TEXT NOT NULL DEFAULT 'DO',
  fide_id       TEXT UNIQUE,
  fide_rating   INT,
  local_rating  INT,
  photo_url     TEXT,
  bio           TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_players_slug        ON players(slug);
CREATE INDEX IF NOT EXISTS idx_players_fide_rating ON players(fide_rating DESC NULLS LAST);
CREATE TRIGGER trg_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ENUMs
CREATE TYPE tournament_status AS ENUM ('draft','published','ongoing','finished','cancelled');
CREATE TYPE tournament_type   AS ENUM ('open','invitational','online','blitz','rapid','classical','simultaneous');
CREATE TYPE news_status        AS ENUM ('draft','published');
CREATE TYPE sponsor_tier       AS ENUM ('platinum','gold','silver','bronze','media');

-- TABLA: tournaments
CREATE TABLE IF NOT EXISTS tournaments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  TEXT NOT NULL UNIQUE,
  title                 TEXT NOT NULL,
  description           TEXT,
  content               TEXT,
  type                  tournament_type NOT NULL DEFAULT 'open',
  status                tournament_status NOT NULL DEFAULT 'draft',
  cover_image_url       TEXT,
  location              TEXT,
  location_maps_url     TEXT,
  start_date            DATE NOT NULL,
  end_date              DATE,
  registration_deadline DATE,
  max_participants      INT,
  entry_fee             NUMERIC(10,2),
  prize_pool            TEXT,
  time_control          TEXT,
  rounds                INT,
  inscription_type      TEXT NOT NULL DEFAULT 'external' CHECK (inscription_type IN ('external','form','closed')),
  inscription_url       TEXT,
  organizer_name        TEXT,
  organizer_contact     TEXT,
  is_featured           BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title            TEXT,
  meta_description      TEXT,
  og_image_url          TEXT,
  created_by            UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tournaments_slug       ON tournaments(slug);
CREATE INDEX IF NOT EXISTS idx_tournaments_status     ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_start_date ON tournaments(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_tournaments_featured   ON tournaments(is_featured) WHERE is_featured = TRUE;
CREATE TRIGGER trg_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- TABLA: tournament_categories
CREATE TABLE IF NOT EXISTS tournament_categories (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id  UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  max_rating     INT,
  min_rating     INT,
  prize          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tournament_categories_tournament ON tournament_categories(tournament_id);

-- TABLA: tournament_results
CREATE TABLE IF NOT EXISTS tournament_results (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id       UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  category_id         UUID REFERENCES tournament_categories(id) ON DELETE SET NULL,
  player_id           UUID REFERENCES players(id) ON DELETE SET NULL,
  player_name         TEXT NOT NULL,
  position            INT NOT NULL,
  points              NUMERIC(5,1),
  rating_performance  INT,
  prize_won           TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_results_tournament ON tournament_results(tournament_id);
CREATE INDEX IF NOT EXISTS idx_results_player     ON tournament_results(player_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_results_unique_position ON tournament_results(tournament_id, category_id, position);

-- TABLA: news
CREATE TABLE IF NOT EXISTS news (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  excerpt          TEXT,
  content          TEXT NOT NULL DEFAULT '',
  cover_image_url  TEXT,
  status           news_status NOT NULL DEFAULT 'draft',
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  tournament_id    UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  author_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published_at     TIMESTAMPTZ,
  meta_title       TEXT,
  meta_description TEXT,
  og_image_url     TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_news_slug         ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_status       ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC) WHERE status = 'published';
CREATE TRIGGER trg_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- TABLA: inscriptions
CREATE TABLE IF NOT EXISTS inscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id   UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  fide_id         TEXT,
  category_id     UUID REFERENCES tournament_categories(id) ON DELETE SET NULL,
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_inscriptions_tournament ON inscriptions(tournament_id);

-- TABLA: gallery_albums
CREATE TABLE IF NOT EXISTS gallery_albums (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  description     TEXT,
  cover_image_url TEXT,
  tournament_id   UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_albums_slug      ON gallery_albums(slug);
CREATE INDEX IF NOT EXISTS idx_albums_published ON gallery_albums(is_published) WHERE is_published = TRUE;
CREATE TRIGGER trg_albums_updated_at BEFORE UPDATE ON gallery_albums FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- TABLA: gallery_images
CREATE TABLE IF NOT EXISTS gallery_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id    UUID NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  caption     TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_images_album ON gallery_images(album_id);

-- TABLA: sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  logo_url     TEXT,
  website_url  TEXT,
  tier         sponsor_tier NOT NULL DEFAULT 'bronze',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sponsors_active ON sponsors(tier, sort_order) WHERE is_active = TRUE;
CREATE TRIGGER trg_sponsors_updated_at BEFORE UPDATE ON sponsors FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- TABLA: site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  description TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (key, value, description) VALUES
  ('site_name',        '"WALFA CHESS"',                                          'Nombre del sitio'),
  ('site_tagline',     '"Ajedrez Competitivo en República Dominicana"',          'Tagline del hero'),
  ('contact_email',    '"info@walfachess.com"',                                  'Email de contacto'),
  ('contact_phone',    '""',                                                     'Teléfono de contacto'),
  ('contact_address',  '""',                                                     'Dirección física'),
  ('social_instagram', '""',                                                     'URL Instagram'),
  ('social_facebook',  '""',                                                     'URL Facebook'),
  ('social_youtube',   '""',                                                     'URL YouTube'),
  ('hero_image_url',   '""',                                                     'Imagen del hero principal'),
  ('about_text',       '""',                                                     'Texto sobre nosotros'),
  ('fide_affiliate',   '""',                                                     'Número de afiliado FIDE')
ON CONFLICT (key) DO NOTHING;

-- ══════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE players               ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_results    ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscriptions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE news                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums        ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors              ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings         ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'));
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles
CREATE POLICY "admin_manage_profiles"  ON profiles FOR ALL      USING (is_admin());
CREATE POLICY "user_view_own_profile"  ON profiles FOR SELECT   USING (auth.uid() = id);
-- Players
CREATE POLICY "public_read_players"    ON players  FOR SELECT   USING (TRUE);
CREATE POLICY "admin_all_players"      ON players  FOR ALL      USING (is_admin());
-- Tournaments
CREATE POLICY "public_read_tournaments" ON tournaments FOR SELECT USING (status IN ('published','ongoing','finished'));
CREATE POLICY "admin_all_tournaments"   ON tournaments FOR ALL    USING (is_admin());
-- Categories
CREATE POLICY "public_read_categories" ON tournament_categories FOR SELECT USING (EXISTS (SELECT 1 FROM tournaments t WHERE t.id = tournament_id AND t.status IN ('published','ongoing','finished')));
CREATE POLICY "admin_all_categories"   ON tournament_categories FOR ALL    USING (is_admin());
-- Results
CREATE POLICY "public_read_results"    ON tournament_results FOR SELECT USING (EXISTS (SELECT 1 FROM tournaments t WHERE t.id = tournament_id AND t.status IN ('finished','ongoing')));
CREATE POLICY "admin_all_results"      ON tournament_results FOR ALL    USING (is_admin());
-- Inscriptions
CREATE POLICY "public_insert_inscriptions" ON inscriptions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "admin_all_inscriptions"     ON inscriptions FOR ALL    USING (is_admin());
-- News
CREATE POLICY "public_read_news"       ON news         FOR SELECT USING (status = 'published');
CREATE POLICY "admin_all_news"         ON news         FOR ALL    USING (is_admin());
-- Gallery Albums
CREATE POLICY "public_read_albums"     ON gallery_albums FOR SELECT USING (is_published = TRUE);
CREATE POLICY "admin_all_albums"       ON gallery_albums FOR ALL    USING (is_admin());
-- Gallery Images
CREATE POLICY "public_read_images"     ON gallery_images FOR SELECT USING (EXISTS (SELECT 1 FROM gallery_albums a WHERE a.id = album_id AND a.is_published = TRUE));
CREATE POLICY "admin_all_images"       ON gallery_images FOR ALL    USING (is_admin());
-- Sponsors
CREATE POLICY "public_read_sponsors"   ON sponsors      FOR SELECT USING (is_active = TRUE);
CREATE POLICY "admin_all_sponsors"     ON sponsors      FOR ALL    USING (is_admin());
-- Site Settings
CREATE POLICY "public_read_settings"   ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "admin_all_settings"     ON site_settings FOR ALL    USING (is_admin());
