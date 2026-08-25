import type { Metadata } from "next"

export const metadata: Metadata = { title: "Galería" }

export default function Page() {
  return (<div className="p-6"><h1 className="text-2xl font-bold text-chess-navy">Galería</h1><p className="text-muted-foreground mt-2">Próximamente.</p></div>)
}