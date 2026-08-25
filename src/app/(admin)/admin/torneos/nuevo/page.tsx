import type { Metadata } from "next"

export const metadata: Metadata = { title: "Nuevo Torneo" }

export default function Page() {
  return (<div className="p-6"><h1 className="text-2xl font-bold text-chess-navy">Nuevo Torneo</h1><p className="text-muted-foreground mt-2">Próximamente.</p></div>)
}