import { cacheLife } from "next/cache"
import Image from "next/image"
import Link from "next/link"
import { Handshake, ArrowRight } from "lucide-react"
import { getActiveSponsors } from "@/lib/queries/sponsorQueries"
import { SPONSOR_TIER_LABELS, SPONSOR_TIER_ORDER } from "@/lib/constants"

export async function SponsorsSection() {
  "use cache"
  cacheLife("hours")

  const sponsors = await getActiveSponsors()

  // Ordenar por nivel jerárquico y luego por sort_order
  const sortedSponsors = [...sponsors].sort((a, b) => {
    const tierA = SPONSOR_TIER_ORDER[a.tier] ?? 99
    const tierB = SPONSOR_TIER_ORDER[b.tier] ?? 99
    if (tierA !== tierB) return tierA - tierB
    return a.sort_order - b.sort_order
  })

  return (
    <section
      className="py-16 sm:py-20 bg-white border-t border-slate-200"
      aria-labelledby="sponsors-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#1D64F2] uppercase tracking-wider mb-3">
            <Handshake className="h-3.5 w-3.5" />
            <span>Alianzas Institucionales</span>
          </div>
          <h2
            id="sponsors-heading"
            className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"
          >
            Nuestros Patrocinadores
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Instituciones y empresas comprometidas con el crecimiento y la excelencia del ajedrez dominicano.
          </p>
        </div>

        {sortedSponsors.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center">
            {sortedSponsors.map((sponsor) => {
              const cardContent = (
                <div className="h-28 rounded-2xl border border-slate-200 bg-white p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#1D64F2] hover:shadow-md group shadow-sm">
                  {sponsor.logo_url ? (
                    <div className="relative h-14 w-full flex items-center justify-center">
                      <Image
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        fill
                        className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        sizes="(max-width: 640px) 120px, 160px"
                      />
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-slate-900 line-clamp-2">
                      {sponsor.name}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-widest text-[#1D64F2] font-bold mt-2 opacity-75 group-hover:opacity-100">
                    {SPONSOR_TIER_LABELS[sponsor.tier]}
                  </span>
                </div>
              )

              return sponsor.website_url ? (
                <a
                  key={sponsor.id}
                  href={sponsor.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D64F2] rounded-2xl"
                  title={`Visitar web de ${sponsor.name}`}
                >
                  {cardContent}
                </a>
              ) : (
                <div key={sponsor.id}>{cardContent}</div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 text-center shadow-sm max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              ¿Te gustaría patrocinar el ajedrez dominicano?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Únete como marca aliada oficial en nuestros próximos torneos nacionales y regionales.
            </p>
            <div className="mt-6">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1D64F2] hover:underline"
              >
                Solicitar información de patrocinio <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
