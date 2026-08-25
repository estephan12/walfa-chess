// ══════════════════════════════════════════════════════════════
// WALFA CHESS — Tipos de Dominio
// ══════════════════════════════════════════════════════════════

export type UserRole = 'admin' | 'super_admin'

export type TournamentStatus =
  | 'draft'
  | 'published'
  | 'ongoing'
  | 'finished'
  | 'cancelled'

export type TournamentType =
  | 'open'
  | 'invitational'
  | 'online'
  | 'blitz'
  | 'rapid'
  | 'classical'
  | 'simultaneous'

export type NewsStatus = 'draft' | 'published'

export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'media'

export type InscriptionStatus = 'pending' | 'confirmed' | 'rejected'

export type InscriptionType = 'external' | 'form' | 'closed'

// ── Profiles ─────────────────────────────────
export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

// ── Players ───────────────────────────────────
export interface Player {
  id: string
  full_name: string
  slug: string
  birth_date: string | null
  nationality: string
  fide_id: string | null
  fide_rating: number | null
  local_rating: number | null
  photo_url: string | null
  bio: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── Tournaments ───────────────────────────────
export interface Tournament {
  id: string
  slug: string
  title: string
  description: string | null
  content: string | null
  type: TournamentType
  status: TournamentStatus
  cover_image_url: string | null
  location: string | null
  location_maps_url: string | null
  start_date: string
  end_date: string | null
  registration_deadline: string | null
  max_participants: number | null
  entry_fee: number | null
  prize_pool: string | null
  time_control: string | null
  rounds: number | null
  inscription_type: InscriptionType
  inscription_url: string | null
  organizer_name: string | null
  organizer_contact: string | null
  is_featured: boolean
  meta_title: string | null
  meta_description: string | null
  og_image_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface TournamentCategory {
  id: string
  tournament_id: string
  name: string
  max_rating: number | null
  min_rating: number | null
  prize: string | null
  created_at: string
}

export interface TournamentResult {
  id: string
  tournament_id: string
  category_id: string | null
  player_id: string | null
  player_name: string
  position: number
  points: number | null
  rating_performance: number | null
  prize_won: string | null
  created_at: string
  // relations
  player?: Player | null
  category?: TournamentCategory | null
}

// ── News ──────────────────────────────────────
export interface News {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  status: NewsStatus
  is_featured: boolean
  tournament_id: string | null
  author_id: string | null
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  og_image_url: string | null
  created_at: string
  updated_at: string
  // relations
  author?: Profile | null
  tournament?: Tournament | null
}

// ── Inscriptions ──────────────────────────────
export interface Inscription {
  id: string
  tournament_id: string
  full_name: string
  email: string
  phone: string | null
  fide_id: string | null
  category_id: string | null
  notes: string | null
  status: InscriptionStatus
  created_at: string
  // relations
  tournament?: Tournament | null
  category?: TournamentCategory | null
}

// ── Gallery ───────────────────────────────────
export interface GalleryAlbum {
  id: string
  slug: string
  title: string
  description: string | null
  cover_image_url: string | null
  tournament_id: string | null
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
  // relations
  images?: GalleryImage[]
  _count?: { images: number }
}

export interface GalleryImage {
  id: string
  album_id: string
  url: string
  alt_text: string | null
  caption: string | null
  sort_order: number
  created_at: string
}

// ── Sponsors ──────────────────────────────────
export interface Sponsor {
  id: string
  name: string
  logo_url: string | null
  website_url: string | null
  tier: SponsorTier
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// ── Site Settings ─────────────────────────────
export interface SiteSetting {
  key: string
  value: unknown
  description: string | null
  updated_at: string
}

export interface SiteSettings {
  site_name: string
  site_tagline: string
  contact_email: string
  contact_phone: string
  contact_address: string
  social_instagram: string
  social_facebook: string
  social_youtube: string
  hero_image_url: string
  about_text: string
  fide_affiliate: string
}

// ── Server Action Results ─────────────────────
export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string }

// ── Pagination ────────────────────────────────
export interface PaginatedResult<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
