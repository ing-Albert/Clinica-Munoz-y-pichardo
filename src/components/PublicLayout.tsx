import {
  AlertCircle,
  ArrowRight,
  Mail,
  Menu,
  Phone,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useClinicData } from '../context/ClinicDataContext'
import { phoneHref } from '../lib/contact'
import { Brand } from './Brand'

const navigation = [
  { label: 'Especialidades', to: '/especialidades' },
  { label: 'Equipo médico', to: '/medicos' },
  { label: 'Noticias y avisos', to: '/noticias' },
  { label: 'La clínica', to: '/clinica' },
  { label: 'Contacto', to: '/contacto' },
]

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobileNav, setIsMobileNav] = useState(() => window.matchMedia('(max-width: 1020px)').matches)
  const menuRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { notices, settings } = useClinicData()
  const currentNotice = notices.find((notice) => notice.active)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1020px)')
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileNav(event.matches)
      if (!event.matches) setMenuOpen(false)
    }
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!isMobileNav || !menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        window.requestAnimationFrame(() => menuButtonRef.current?.focus())
        return
      }
      if (event.key !== 'Tab' || !menuRef.current) return

      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileNav, menuOpen])

  const closeMenu = (restoreFocus = false) => {
    setMenuOpen(false)
    if (restoreFocus && isMobileNav) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus())
    }
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido
      </a>

      {currentNotice && (
        <aside className={`notice-strip notice-strip--${currentNotice.type}`} aria-label="Aviso de la clínica">
          <div className="container notice-strip__inner">
            <AlertCircle size={18} aria-hidden="true" />
            <p>
              <strong>{currentNotice.title}:</strong> {currentNotice.message}
            </p>
            {currentNotice.ctaLabel && currentNotice.ctaUrl && (
              <Link to={currentNotice.ctaUrl}>
                {currentNotice.ctaLabel} <ArrowRight size={15} aria-hidden="true" />
              </Link>
            )}
          </div>
        </aside>
      )}

      <header className="site-header">
        <div className="container site-header__inner">
          <Brand />
          <nav
            ref={menuRef}
            id="menu-principal"
            className={`main-nav${menuOpen ? ' main-nav--open' : ''}`}
            aria-label="Navegación principal"
            aria-hidden={isMobileNav && !menuOpen}
            inert={isMobileNav && !menuOpen ? true : undefined}
          >
            <div className="main-nav__mobile-head">
              <span>Menú</span>
              <button ref={closeButtonRef} type="button" onClick={() => closeMenu(true)} aria-label="Cerrar menú">
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                onClick={() => closeMenu()}
              >
                {item.label}
              </NavLink>
            ))}

          </nav>
          {menuOpen && (
            <button className="nav-backdrop" type="button" aria-label="Cerrar menú" onClick={() => closeMenu(true)} />
          )}

          <button
            ref={menuButtonRef}
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu-principal"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={25} aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="contenido-principal">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__top">
          <div className="site-footer__brand">
            <Brand inverse />
            <p>
              Atención médica cercana, información clara y especialistas que trabajan de forma coordinada.
            </p>
            <div className="social-links" aria-label="Redes sociales">
              <a href="https://www.instagram.com" aria-label="Instagram">
                <span aria-hidden="true">IG</span>
              </a>
              <a href="https://www.facebook.com" aria-label="Facebook">
                <span aria-hidden="true">f</span>
              </a>
            </div>
          </div>
          <div className="site-footer__column">
            <h2>Explorar</h2>
            {navigation.slice(0, 4).map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="site-footer__column">
            <h2>Visítenos</h2>
            <p>{settings.address}</p>
            <p>{settings.hoursWeek}</p>
            <p>{settings.hoursSaturday}</p>
          </div>
          <div className="site-footer__column site-footer__contact">
            <h2>Contacto</h2>
            <a href={phoneHref(settings.phone)}>
              <Phone size={17} aria-hidden="true" /> {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`}>
              <Mail size={17} aria-hidden="true" /> {settings.email}
            </a>
            <Link className="footer-cta" to="/contacto?motivo=cita">
              Solicitar una cita <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="container site-footer__emergency">
          <AlertCircle size={17} aria-hidden="true" />
          <p>{settings.emergencyNote}</p>
        </div>
        <div className="container site-footer__bottom">
          <p>© {new Date().getFullYear()} {settings.clinicName} · Contenido demostrativo.</p>
          <div>
            <Link to="/privacidad">Privacidad</Link>
            <Link to="/accesibilidad">Accesibilidad</Link>
            <Link to="/admin/acceso">Administrar sitio</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
