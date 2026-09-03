import Link from "next/link"
import { Trophy, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-white text-slate-900">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 text-[#1D64F2]">
          <Trophy className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-[#1D64F2] uppercase tracking-wider">
            Error 404
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Página No Encontrada
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            El artículo, torneo o recurso que buscas no existe o ha sido reubicado en el portal oficial de WALFA-CHESS.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#1D64F2] text-white hover:bg-[#1554cf] font-bold text-sm px-6">
              <Home className="h-4 w-4 mr-2" />
              Ir al Inicio
            </Button>
          </Link>
          <Link href="/noticias" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 font-bold text-sm px-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ver Noticias
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
