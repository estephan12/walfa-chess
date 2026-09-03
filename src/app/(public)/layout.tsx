import type { ReactNode } from "react"
import { Suspense } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#1D64F2]/15 selection:text-[#1D64F2]">
      <Suspense fallback={<div className="h-20 bg-[#0A1931]" />}>
        <Navbar />
      </Suspense>
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}
