"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { LogoutButton } from "@/components/LogoutButton"
import Link from "next/link"
import {
  LayoutDashboard, BookOpen, BookMarked,
  Users, Settings, ChevronRight, Menu, X, GraduationCap
} from "lucide-react"
import { useSession } from "next-auth/react"
import Logo from "@/components/Logo"

const navLinks = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/epreuves",
    label: "Épreuves",
    icon: BookOpen,
  },
  {
    href: "/admin/matieres",
    label: "Matières",
    icon: BookMarked,
  },
  {
    href: "/admin/filieres",
    label: "Filières",
    icon: GraduationCap,
  },
  {
    href: "/admin/utilisateurs",
    label: "Utilisateurs",
    icon: Users,
  },
  {
    href: "/admin/settings",
    label: "Paramètres",
    icon: Settings,
  },
]

function Sidebar({
  onClose,
  isMobile,
}: {
  onClose?: () => void
  isMobile?: boolean
}) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside
      className={`flex flex-col h-full bg-white ${
        isMobile ? "w-72" : "w-64"
      }`}
    >
      {/* Header sidebar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <Logo href="/" width={90} height={30} />
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Label section */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Administration
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              onClick={isMobile ? onClose : undefined}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:translate-x-0.5"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-700"
                }`}
              />
              <span>{label}</span>
              {!isActive && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 text-slate-300" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer user */}
      <div className="p-3 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(session?.user?.name ?? session?.user?.email ?? "A")
                .toString()[0]
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {session?.user?.name ?? "Admin"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Ferme sidebar quand on change de page (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Empêche le scroll du body quand sidebar ouverte
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── DESKTOP sidebar fixe ── */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-10 shadow-xl">
        <Sidebar />
      </div>

      {/* ── MOBILE sidebar overlay ── */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 shadow-2xl lg:hidden animate-in slide-in-from-left duration-300">
            <Sidebar
              onClose={() => setSidebarOpen(false)}
              isMobile={true}
            />
          </div>
        </>
      )}

      {/* ── Contenu principal ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar mobile */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between px-4 h-14">
            {/* Bouton hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo centré */}
            <Logo href="/" width={80} height={26} />

            {/* Placeholder pour centrer logo */}
            <div className="w-9" />
          </div>
        </header>

        {/* Page content — scroll interne */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
