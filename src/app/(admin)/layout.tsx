import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/layout/AdminSidebar"

export const instant = false

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await connection()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0B0F19] text-[#F0F4F8]">
      <AdminSidebar userEmail={user.email ?? ""} />
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:p-10 w-full max-w-full overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
