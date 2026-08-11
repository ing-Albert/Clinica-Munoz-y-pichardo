import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute'
import { PublicLayout } from './components/PublicLayout'
import { ClinicDataProvider, useClinicData } from './context/ClinicDataContext'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminPage } from './pages/AdminPage'
import { ClinicPage } from './pages/ClinicPage'
import { ContactPage } from './pages/ContactPage'
import { DoctorProfilePage } from './pages/DoctorProfilePage'
import { DoctorsPage } from './pages/DoctorsPage'
import { HomePage } from './pages/HomePage'
import { AccessibilityPage, PrivacyPage } from './pages/LegalPages'
import { NewsDetailPage } from './pages/NewsDetailPage'
import { NewsPage } from './pages/NewsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SpecialtiesPage } from './pages/SpecialtiesPage'
import { SpecialtyPage } from './pages/SpecialtyPage'

function RouteEffects() {
  const { hash, pathname } = useLocation()
  const { settings } = useClinicData()

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      })
      return
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [hash, pathname])

  useEffect(() => {
    const section = pathname.split('/')[1]
    const sectionTitles: Record<string, string> = {
      especialidades: 'Especialidades',
      medicos: pathname.split('/').length > 2 ? 'Perfil médico' : 'Equipo médico',
      noticias: pathname.split('/').length > 2 ? 'Artículo' : 'Noticias y avisos',
      clinica: 'La clínica',
      contacto: 'Contacto y citas',
      privacidad: 'Privacidad',
      accesibilidad: 'Accesibilidad',
      admin: 'Administración',
    }
    document.title = section
      ? `${sectionTitles[section] ?? 'Página'} | ${settings.clinicName}`
      : `${settings.clinicName} | ${settings.descriptor}`

    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.setAttribute(
        'content',
        `${settings.clinicName}: ${settings.descriptor.toLocaleLowerCase('es')}, especialidades, equipo médico y contacto.`,
      )
  }, [pathname, settings.clinicName, settings.descriptor])

  return null
}

export default function App() {
  return (
    <ClinicDataProvider>
      <BrowserRouter>
        <RouteEffects />
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="especialidades" element={<SpecialtiesPage />} />
            <Route path="especialidades/:slug" element={<SpecialtyPage />} />
            <Route path="medicos" element={<DoctorsPage />} />
            <Route path="medicos/:slug" element={<DoctorProfilePage />} />
            <Route path="noticias" element={<NewsPage />} />
            <Route path="noticias/:slug" element={<NewsDetailPage />} />
            <Route path="clinica" element={<ClinicPage />} />
            <Route path="contacto" element={<ContactPage />} />
            <Route path="privacidad" element={<PrivacyPage />} />
            <Route path="accesibilidad" element={<AccessibilityPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin/acceso" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ClinicDataProvider>
  )
}
