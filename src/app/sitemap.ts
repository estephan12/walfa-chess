import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { SITE_URL } from "@/lib/constants"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/torneos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/noticias`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/resultados`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/clasificacion`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/galeria`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/inscripciones`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ]

  // Torneos publicados
  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("slug, updated_at")
    .in("status", ["published", "ongoing", "finished"])

  const tournamentRoutes: MetadataRoute.Sitemap = (tournaments ?? []).map((t) => ({
    url: `${SITE_URL}/torneos/${t.slug}`,
    lastModified: new Date(t.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Noticias publicadas
  const { data: news } = await supabase
    .from("news")
    .select("slug, updated_at")
    .eq("status", "published")

  const newsRoutes: MetadataRoute.Sitemap = (news ?? []).map((n) => ({
    url: `${SITE_URL}/noticias/${n.slug}`,
    lastModified: new Date(n.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...tournamentRoutes, ...newsRoutes]
}
