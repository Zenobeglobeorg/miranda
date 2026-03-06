import Link from "next/link"
import Logo from "@/components/Logo"

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Épreuves", href: "/epreuves" },
  { label: "Concours", href: "/concours" },
  { label: "Contact", href: "/contact" },
] as const

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo
                href="/"
                width={100}
                height={34}
                className="brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed">
              La plateforme officielle des épreuves de Prepas Vogt.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </p>
            <ul className="space-y-2.5">
              {navItems.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Filières */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Filières
            </p>
            <ul className="space-y-2.5">
              {["SPH", "IGC", "MF", "IGEA", "INGE"].map((code) => (
                <li key={code}>
                  <span className="text-sm">{code}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>mirandaawoulebe@gmail.com</li>
              <li>+237 687 433 132</li>
              <li>Prepas Vogt, Cameroun</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} Miranda. Tous droits réservés.
          </p>
          <div className="flex gap-5 text-xs">
            <Link
              href="/mentions-legales"
              className="hover:text-white transition-colors duration-200"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="hover:text-white transition-colors duration-200"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
