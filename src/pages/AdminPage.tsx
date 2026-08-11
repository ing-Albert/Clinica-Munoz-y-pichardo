import {
  Bell,
  BookOpenText,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ExternalLink,
  FilePenLine,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Pencil,
  Plus,
  Save,
  Search,
  Settings,
  Stethoscope,
  Trash2,
  X,
} from 'lucide-react'
import { useDeferredValue, useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import {
  useClinicData,
  type NewsDraft,
  type NoticeDraft,
  type SpecialtyDraft,
} from '../context/ClinicDataContext'
import { endAdminSession } from '../lib/auth'
import type {
  Doctor,
  NewsCategory,
  NoticeType,
  Specialty,
  SpecialtyIconName,
} from '../types'

type AdminSection = 'overview' | 'doctors' | 'specialties' | 'news' | 'notices' | 'settings'

const adminNavigation: Array<{
  id: AdminSection
  label: string
  icon: typeof LayoutDashboard
}> = [
    { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
    { id: 'doctors', label: 'Equipo médico', icon: Stethoscope },
    { id: 'specialties', label: 'Especialidades', icon: BookOpenText },
    { id: 'news', label: 'Noticias', icon: Newspaper },
    { id: 'notices', label: 'Avisos', icon: Bell },
    { id: 'settings', label: 'Datos de la clínica', icon: Settings },
  ]

const dateFormatter = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024

async function optimizeDoctorImage(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Use una imagen JPG, PNG o WebP.')
  }
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error('La imagen no puede superar 10 MB.')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 640 / bitmap.width, 800 / bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('No fue posible procesar la imagen.')
  }

  context.fillStyle = '#eef3f7'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  let quality = 0.76
  let result = canvas.toDataURL('image/jpeg', quality)
  while (result.length > 180_000 && quality > 0.42) {
    quality -= 0.08
    result = canvas.toDataURL('image/jpeg', quality)
  }
  return result
}

export function AdminPage() {
  const [section, setSection] = useState<AdminSection>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [isMobileSidebar, setIsMobileSidebar] = useState(() => window.matchMedia('(max-width: 1020px)').matches)
  const sidebarRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { doctors, news, notices, specialties } = useClinicData()
  const navigate = useNavigate()
  const sectionLabel = adminNavigation.find((item) => item.id === section)?.label ?? 'Panel'

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1020px)')
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileSidebar(event.matches)
      if (!event.matches) setSidebarOpen(false)
    }
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!isMobileSidebar || !sidebarOpen) return

    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false)
        window.requestAnimationFrame(() => menuButtonRef.current?.focus())
        return
      }
      if (event.key !== 'Tab' || !sidebarRef.current) return

      const focusable = Array.from(
        sidebarRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
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
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileSidebar, sidebarOpen])


  const closeSidebar = (restoreFocus = false) => {
    setSidebarOpen(false)
    if (restoreFocus && isMobileSidebar) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus())
    }
  }

  const openSection = (nextSection: AdminSection) => {
    setSection(nextSection)
    closeSidebar()
  }

  const logout = () => {
    endAdminSession()
    navigate('/admin/acceso', { replace: true })
  }

  return (
    <div className="admin-shell">
      <aside
        ref={sidebarRef}
        className={`admin-sidebar${sidebarOpen ? ' admin-sidebar--open' : ''}`}
        aria-hidden={isMobileSidebar && !sidebarOpen}
        inert={isMobileSidebar && !sidebarOpen ? true : undefined}
      >
        <div className="admin-sidebar__brand">
          <Brand inverse />
          <button ref={closeButtonRef} type="button" onClick={() => closeSidebar(true)} aria-label="Cerrar menú">
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="admin-sidebar__context">
          <span><CircleUserRound size={19} aria-hidden="true" /></span>
          <div><strong>Panel editorial</strong><small>Administrador/a</small></div>
        </div>
        <nav aria-label="Secciones administrativas">
          {adminNavigation.map((item) => {
            const Icon = item.icon
            const count = item.id === 'doctors'
              ? doctors.length
              : item.id === 'specialties'
                ? specialties.length
                : item.id === 'news'
                  ? news.length
                  : item.id === 'notices'
                    ? notices.filter((notice) => notice.active).length
                    : undefined
            return (
              <button
                key={item.id}
                className={section === item.id ? 'active' : ''}
                type="button"
                onClick={() => openSection(item.id)}
              >
                <Icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
                {count !== undefined && <small>{count}</small>}
              </button>
            )
          })}
        </nav>
        <div className="admin-sidebar__footer">
          <Link to="/" target="_blank">
            <ExternalLink size={18} aria-hidden="true" /> Ver sitio público
          </Link>
          <button type="button" onClick={logout}>
            <LogOut size={18} aria-hidden="true" /> Cerrar sesión
          </button>
        </div>
      </aside>
      {sidebarOpen && (
        <button className="admin-sidebar-backdrop" type="button" onClick={() => closeSidebar(true)} aria-label="Cerrar navegación" />
      )}

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <button ref={menuButtonRef} className="admin-menu-button" type="button" onClick={() => setSidebarOpen(true)} aria-label="Abrir navegación">
              <Menu size={22} aria-hidden="true" />
            </button>
            <div><small>Administración</small><strong>{sectionLabel}</strong></div>
          </div>
          <div className="admin-topbar__actions">
            <Link to="/" target="_blank"><ExternalLink size={17} aria-hidden="true" /> Vista pública</Link>
            <span className="admin-avatar">AM</span>
          </div>
        </header>

        <main className="admin-main">
          {section === 'overview' && <AdminOverview onNavigate={openSection} />}
          {section === 'doctors' && <DoctorsAdmin />}
          {section === 'specialties' && <SpecialtiesAdmin />}
          {section === 'news' && <NewsAdmin />}
          {section === 'notices' && <NoticesAdmin />}
          {section === 'settings' && <SettingsAdmin />}
        </main>
      </div>
    </div>
  )
}

function AdminOverview({ onNavigate }: { onNavigate: (section: AdminSection) => void }) {
  const { doctors, news, notices, specialties } = useClinicData()
  const activeNotices = notices.filter((notice) => notice.active)
  const publishedNews = news.filter((article) => article.published)
  const unconfirmedDoctors = doctors.filter((doctor) => Boolean(doctor.availabilityLabel))

  const cards = [
    { label: 'Profesionales', value: doctors.length, detail: `${unconfirmedDoctors.length} con disponibilidad por confirmar`, icon: Stethoscope, section: 'doctors' as const },
    { label: 'Especialidades', value: specialties.length, detail: `${specialties.filter((item) => item.featured).length} destacadas`, icon: BookOpenText, section: 'specialties' as const },
    { label: 'Noticias publicadas', value: publishedNews.length, detail: `${news.length - publishedNews.length} borradores`, icon: Newspaper, section: 'news' as const },
    { label: 'Avisos activos', value: activeNotices.length, detail: `${notices.length} avisos en total`, icon: Bell, section: 'notices' as const },
  ]

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div><p>Resumen general</p><h1>Buenos días, Administrador/a.</h1><span>Este es el estado actual del contenido público.</span></div>
        <button className="button button--admin-primary" type="button" onClick={() => onNavigate('news')}>
          <Plus size={17} aria-hidden="true" /> Nueva publicación
        </button>
      </div>

      <div className="admin-stat-grid">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <button key={card.label} className="admin-stat-card" type="button" onClick={() => onNavigate(card.section)}>
              <span className="admin-stat-card__icon"><Icon size={21} aria-hidden="true" /></span>
              <span className="admin-stat-card__value">{card.value}</span>
              <strong>{card.label}</strong>
              <small>{card.detail}</small>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          )
        })}
      </div>

      <div className="admin-overview-grid">
        <section className="admin-panel-card">
          <div className="admin-panel-card__heading">
            <div><h2>Publicaciones recientes</h2><p>Estado del contenido editorial</p></div>
            <button type="button" onClick={() => onNavigate('news')}>Ver todas</button>
          </div>
          <div className="admin-recent-list">
            {news.slice(0, 4).map((article) => (
              <div key={article.id}>
                <img src={article.image} alt="" />
                <span><strong>{article.title}</strong><small>{article.category} · {dateFormatter.format(new Date(article.date))}</small></span>
                <em className={article.published ? 'status-published' : 'status-draft'}>{article.published ? 'Publicada' : 'Borrador'}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel-card admin-quick-panel">
          <div className="admin-panel-card__heading"><div><h2>Acciones rápidas</h2><p>Actualice el sitio</p></div></div>
          <button type="button" onClick={() => onNavigate('notices')}><span><Bell size={19} aria-hidden="true" /></span><div><strong>Publicar un aviso</strong><small>Horarios o cambios de servicio</small></div><ChevronRight size={17} aria-hidden="true" /></button>
          <button type="button" onClick={() => onNavigate('doctors')}><span><CircleUserRound size={19} aria-hidden="true" /></span><div><strong>Editar un médico</strong><small>Perfil, consultorio y contacto</small></div><ChevronRight size={17} aria-hidden="true" /></button>
          <button type="button" onClick={() => onNavigate('settings')}><span><Settings size={19} aria-hidden="true" /></span><div><strong>Datos de la clínica</strong><small>Teléfono, dirección y horarios</small></div><ChevronRight size={17} aria-hidden="true" /></button>
        </section>
      </div>
    </div>
  )
}

function DoctorsAdmin() {
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query)
  const { doctors, specialties } = useClinicData()
  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase('es')
  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.name} ${doctor.role}`.toLocaleLowerCase('es').includes(normalizedQuery),
  )
  const editingDoctor = doctors.find((doctor) => doctor.id === editingId)

  if (editingDoctor) {
    return <DoctorEditor key={editingDoctor.id} doctor={editingDoctor} specialties={specialties} onClose={() => setEditingId(null)} />
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div><p>Contenido clínico</p><h1>Equipo médico</h1><span>Edite la información que aparece en cada perfil profesional.</span></div>
      </div>
      <section className="admin-table-card">
        <div className="admin-table-toolbar">
          <label><Search size={18} aria-hidden="true" /><span className="sr-only">Buscar médico</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre o cargo" /></label>
          <span>{filteredDoctors.length} perfiles</span>
        </div>
        <div className="admin-doctor-list">
          {filteredDoctors.map((doctor) => {
            const specialtyNames = doctor.specialtyIds.map((id) => specialties.find((item) => item.id === id)?.name).filter(Boolean).join(', ')
            return (
              <article key={doctor.id}>
                <img src={doctor.image} alt="" style={{ objectPosition: doctor.imagePosition }} />
                <div><h2>{doctor.name}</h2><p>{specialtyNames}</p><small>{doctor.floor} · {doctor.office}</small></div>
                <span className={doctor.availabilityLabel ? 'status-neutral' : doctor.acceptingAppointments ? 'status-published' : 'status-draft'}>{doctor.availabilityLabel ?? (doctor.acceptingAppointments ? 'Disponible' : 'Lista de espera')}</span>
                <button className="button button--admin-secondary" type="button" onClick={() => setEditingId(doctor.id)}><Pencil size={16} aria-hidden="true" /> Editar perfil</button>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function DoctorEditor({ doctor, specialties, onClose }: { doctor: Doctor; specialties: Specialty[]; onClose: () => void }) {
  const [message, setMessage] = useState('')
  const [image, setImage] = useState(doctor.image)
  const [imageMessage, setImageMessage] = useState('')
  const [processingImage, setProcessingImage] = useState(false)
  const { updateDoctor } = useClinicData()

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setProcessingImage(true)
    setImageMessage('Procesando imagen...')
    try {
      const optimizedImage = await optimizeDoctorImage(file)
      setImage(optimizedImage)
      setImageMessage(`Imagen lista: ${file.name}`)
    } catch (error) {
      setImageMessage(error instanceof Error ? error.message : 'No fue posible cargar la imagen.')
    } finally {
      setProcessingImage(false)
      event.target.value = ''
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (processingImage) {
      setMessage('Espere a que termine de procesarse la fotografía.')
      return
    }
    const formData = new FormData(event.currentTarget)
    const specialtyIds = formData.getAll('specialties').map(String)
    if (specialtyIds.length === 0) {
      setMessage('Seleccione al menos una especialidad.')
      return
    }
    if (!image) {
      setMessage('Seleccione una fotografía para el profesional.')
      return
    }

    updateDoctor(doctor.id, {
      name: String(formData.get('name')),
      role: String(formData.get('role')),
      specialtyIds,
      focus: String(formData.get('focus')).split('\n').map((item) => item.trim()).filter(Boolean),
      image,
      imageIsPlaceholder: Boolean(doctor.imageIsPlaceholder && image === doctor.image),
      bio: String(formData.get('bio')),
      building: String(formData.get('building')),
      floor: String(formData.get('floor')),
      office: String(formData.get('office')),
      phone: String(formData.get('phone')),
      email: String(formData.get('email')),
      schedule: String(formData.get('schedule')),
      nextAvailable: String(formData.get('nextAvailable')),
      availabilityLabel: String(formData.get('availabilityLabel')).trim() || undefined,
      languages: String(formData.get('languages')).split(',').map((item) => item.trim()).filter(Boolean),
      education: String(formData.get('education')).split('\n').map((item) => item.trim()).filter(Boolean),
      acceptingAppointments: formData.get('acceptingAppointments') === 'on',
      featured: formData.get('featured') === 'on',
    })
    setMessage('Perfil actualizado correctamente.')
  }

  return (
    <div className="admin-page">
      <div className="admin-editor-heading">
        <button type="button" onClick={onClose}><X size={18} aria-hidden="true" /> Cerrar edición</button>
        <div><p>Editando perfil</p><h1>{doctor.name}</h1><span>Los cambios se reflejan de inmediato en el directorio público.</span></div>
        <Link to={`/medicos/${doctor.slug}`} target="_blank"><ExternalLink size={17} aria-hidden="true" /> Ver perfil público</Link>
      </div>
      <form className="admin-editor-form" onSubmit={handleSubmit}>
        <section className="admin-form-card">
          <div className="admin-form-card__heading"><span>01</span><div><h2>Información principal</h2><p>Nombre, cargo, fotografía y presentación profesional.</p></div></div>
          <div className="admin-form-grid admin-form-grid--two">
            <label>Nombre completo<input name="name" defaultValue={doctor.name} required /></label>
            <label>Cargo o título<input name="role" defaultValue={doctor.role} required /></label>
          </div>
          <div className="admin-photo-editor">
            <div className="admin-photo-editor__preview">
              <img src={image} alt={`Vista previa de ${doctor.name}`} style={{ objectPosition: doctor.imagePosition }} />
            </div>
            <div className="admin-photo-editor__controls">
              <div>
                <strong>Fotografía del profesional</strong>
                <p>Seleccione una imagen vertical. Se optimizará automáticamente antes de guardarse.</p>
              </div>
              <label className="button button--admin-secondary admin-photo-upload">
                <ImagePlus size={17} aria-hidden="true" />
                {processingImage ? 'Procesando...' : 'Seleccionar imagen'}
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={processingImage}
                />
              </label>
              <label>
                O utilizar una URL
                <input
                  type="url"
                  value={image.startsWith('data:image/') ? '' : image}
                  onChange={(event) => {
                    setImage(event.target.value)
                    setImageMessage('')
                  }}
                  placeholder={image.startsWith('data:image/') ? 'Imagen cargada desde su equipo' : 'https://...'}
                />
              </label>
              {imageMessage && <p className="admin-photo-editor__status" role="status">{imageMessage}</p>}
            </div>
          </div>
          <label>Biografía<textarea name="bio" rows={5} defaultValue={doctor.bio} required /></label>
          <label>Áreas de enfoque <small>Una por línea</small><textarea name="focus" rows={4} defaultValue={doctor.focus.join('\n')} required /></label>
        </section>

        <section className="admin-form-card">
          <div className="admin-form-card__heading"><span>02</span><div><h2>Especialidades</h2><p>Seleccione las áreas relacionadas con este profesional.</p></div></div>
          <div className="admin-checkbox-grid">
            {specialties.map((specialty) => (
              <label key={specialty.id}><input type="checkbox" name="specialties" value={specialty.id} defaultChecked={doctor.specialtyIds.includes(specialty.id)} /><span><CheckCircle2 size={18} aria-hidden="true" />{specialty.name}</span></label>
            ))}
          </div>
        </section>

        <section className="admin-form-card">
          <div className="admin-form-card__heading"><span>03</span><div><h2>Ubicación y contacto</h2><p>Información práctica que verá el paciente en el perfil.</p></div></div>
          <div className="admin-form-grid admin-form-grid--three">
            <label>Edificio<input name="building" defaultValue={doctor.building} required /></label>
            <label>Piso<input name="floor" defaultValue={doctor.floor} required /></label>
            <label>Consultorio<input name="office" defaultValue={doctor.office} required /></label>
          </div>
          <div className="admin-form-grid admin-form-grid--two">
            <label>Teléfono<input name="phone" type="tel" defaultValue={doctor.phone} required /></label>
            <label>Correo<input name="email" type="email" defaultValue={doctor.email} required /></label>
          </div>
          <label>Horario<input name="schedule" defaultValue={doctor.schedule} required /></label>
          <div className="admin-form-grid admin-form-grid--two">
            <label>Información de disponibilidad<input name="nextAvailable" defaultValue={doctor.nextAvailable} required /></label>
            <label>Etiqueta pública <small>Opcional</small><input name="availabilityLabel" defaultValue={doctor.availabilityLabel} placeholder="Ej. Consultar disponibilidad" /></label>
          </div>
        </section>

        <section className="admin-form-card">
          <div className="admin-form-card__heading"><span>04</span><div><h2>Trayectoria y publicación</h2><p>Formación, idiomas y estado del perfil.</p></div></div>
          <label>Formación <small>Un elemento por línea</small><textarea name="education" rows={4} defaultValue={doctor.education.join('\n')} required /></label>
          <label>Idiomas <small>Separados por comas</small><input name="languages" defaultValue={doctor.languages.join(', ')} required /></label>
          <div className="admin-switches">
            <label><input type="checkbox" name="acceptingAppointments" defaultChecked={doctor.acceptingAppointments} /><span aria-hidden="true" /><div><strong>Acepta nuevos pacientes</strong><small>Mostrará disponibilidad en el perfil.</small></div></label>
            <label><input type="checkbox" name="featured" defaultChecked={doctor.featured} /><span aria-hidden="true" /><div><strong>Destacar en inicio</strong><small>Puede aparecer en la página principal.</small></div></label>
          </div>
        </section>

        <div className="admin-editor-actions">
          <span className={message.includes('correctamente') ? 'save-message' : 'form-error'} aria-live="polite">{message}</span>
          <button className="button button--admin-secondary" type="button" onClick={onClose}>Cancelar</button>
          <button className="button button--admin-primary" type="submit" disabled={processingImage}><Save size={17} aria-hidden="true" /> {processingImage ? 'Procesando imagen...' : 'Guardar cambios'}</button>
        </div>
      </form>
    </div>
  )
}

function SpecialtiesAdmin() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [composerOpen, setComposerOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { addSpecialty, doctors, specialties } = useClinicData()
  const editingSpecialty = specialties.find((specialty) => specialty.id === editingId)

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const nameInput = form.elements.namedItem('name') as HTMLInputElement
    const name = String(formData.get('name')).trim()
    if (!name) {
      nameInput.value = ''
      nameInput.reportValidity()
      return
    }
    if (!/[a-z0-9áéíóúüñ]/i.test(name)) {
      nameInput.setCustomValidity('Incluya al menos una letra o un número.')
      nameInput.reportValidity()
      return
    }
    const draft: SpecialtyDraft = {
      name,
      shortDescription: String(formData.get('shortDescription')).trim(),
      description: String(formData.get('description')).trim(),
      services: String(formData.get('services')).split('\n').map((item) => item.trim()).filter(Boolean),
      icon: String(formData.get('icon')) as SpecialtyIconName,
      featured: formData.get('featured') === 'on',
    }
    addSpecialty(draft)
    form.reset()
    setComposerOpen(false)
    setMessage('Especialidad creada. Ya puede asignarla a cualquier médico.')
  }

  if (editingSpecialty) {
    return <SpecialtyEditor key={editingSpecialty.id} specialty={editingSpecialty} onClose={() => setEditingId(null)} />
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div><p>Catálogo de servicios</p><h1>Especialidades</h1><span>Cree servicios y asígnelos a los perfiles médicos.</span></div>
        <button className="button button--admin-primary" type="button" onClick={() => setComposerOpen(true)}><Plus size={17} aria-hidden="true" /> Nueva especialidad</button>
      </div>
      {message && <p className="admin-success-banner" role="status"><CheckCircle2 size={18} aria-hidden="true" /> {message}</p>}
      {composerOpen && (
        <form className="admin-composer" onSubmit={handleCreate}>
          <div className="admin-composer__heading">
            <div><span><BookOpenText size={20} aria-hidden="true" /></span><div><h2>Nueva especialidad</h2><p>Se añadirá al sitio público y al selector de todos los médicos.</p></div></div>
            <button type="button" onClick={() => setComposerOpen(false)} aria-label="Cerrar"><X size={20} aria-hidden="true" /></button>
          </div>
          <div className="admin-form-grid admin-form-grid--two">
            <label>Nombre<input name="name" placeholder="Ej. Neurología" required maxLength={80} onInput={(event) => event.currentTarget.setCustomValidity('')} /></label>
            <label>Ícono<select name="icon" defaultValue="stethoscope"><option value="stethoscope">Estetoscopio</option><option value="activity">Actividad</option><option value="heart">Corazón</option><option value="baby">Pediatría</option><option value="microscope">Microscopio</option><option value="sparkles">Bienestar</option></select></label>
          </div>
          <label>Descripción breve<input name="shortDescription" placeholder="Resumen visible en el catálogo" required maxLength={120} /></label>
          <label>Descripción completa<textarea name="description" rows={4} required /></label>
          <label>Servicios <small>Uno por línea</small><textarea name="services" rows={5} placeholder={'Consulta especializada\nEvaluación preventiva\nSeguimiento clínico'} required /></label>
          <div className="admin-composer__footer">
            <label className="admin-publish-check"><input type="checkbox" name="featured" defaultChecked /><span>Destacar en la página de inicio</span></label>
            <div><button className="button button--admin-secondary" type="button" onClick={() => setComposerOpen(false)}>Cancelar</button><button className="button button--admin-primary" type="submit"><Save size={17} aria-hidden="true" /> Crear especialidad</button></div>
          </div>
        </form>
      )}
      <div className="admin-specialty-grid">
        {specialties.map((specialty) => {
          const doctorCount = doctors.filter((doctor) => doctor.specialtyIds.includes(specialty.id)).length
          return (
            <article key={specialty.id}>
              <div><span>{String(doctorCount).padStart(2, '0')}</span><small>{doctorCount === 1 ? 'profesional' : 'profesionales'}</small></div>
              <h2>{specialty.name}</h2>
              <p>{specialty.shortDescription}</p>
              <ul>{specialty.services.slice(0, 3).map((service) => <li key={service}>{service}</li>)}</ul>
              <button className="button button--admin-secondary" type="button" onClick={() => setEditingId(specialty.id)}><Pencil size={16} aria-hidden="true" /> Editar especialidad</button>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function SpecialtyEditor({ specialty, onClose }: { specialty: Specialty; onClose: () => void }) {
  const [message, setMessage] = useState('')
  const { updateSpecialty } = useClinicData()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const nameInput = form.elements.namedItem('name') as HTMLInputElement
    const name = String(formData.get('name')).trim()
    if (!name) {
      nameInput.value = ''
      nameInput.reportValidity()
      return
    }
    if (!/[a-z0-9áéíóúüñ]/i.test(name)) {
      nameInput.setCustomValidity('Incluya al menos una letra o un número.')
      nameInput.reportValidity()
      return
    }
    updateSpecialty(specialty.id, {
      name,
      shortDescription: String(formData.get('shortDescription')).trim(),
      description: String(formData.get('description')).trim(),
      services: String(formData.get('services')).split('\n').map((item) => item.trim()).filter(Boolean),
      featured: formData.get('featured') === 'on',
    })
    setMessage('Especialidad actualizada correctamente.')
  }

  return (
    <div className="admin-page">
      <div className="admin-editor-heading">
        <button type="button" onClick={onClose}><X size={18} aria-hidden="true" /> Cerrar edición</button>
        <div><p>Editando especialidad</p><h1>{specialty.name}</h1><span>Revise que la descripción sea comprensible para pacientes.</span></div>
        <Link to={`/especialidades/${specialty.slug}`} target="_blank"><ExternalLink size={17} aria-hidden="true" /> Vista pública</Link>
      </div>
      <form className="admin-editor-form" onSubmit={handleSubmit}>
        <section className="admin-form-card">
          <div className="admin-form-card__heading"><span>01</span><div><h2>Contenido público</h2><p>Información principal de la especialidad.</p></div></div>
          <label>Nombre<input name="name" defaultValue={specialty.name} required onInput={(event) => event.currentTarget.setCustomValidity('')} /></label>
          <label>Descripción breve<input name="shortDescription" defaultValue={specialty.shortDescription} required maxLength={120} /></label>
          <label>Descripción completa<textarea name="description" rows={5} defaultValue={specialty.description} required /></label>
          <label>Servicios <small>Uno por línea</small><textarea name="services" rows={6} defaultValue={specialty.services.join('\n')} required /></label>
          <div className="admin-switches">
            <label><input type="checkbox" name="featured" defaultChecked={specialty.featured} /><span aria-hidden="true" /><div><strong>Destacar en inicio</strong><small>Mostrará esta especialidad en la página principal.</small></div></label>
          </div>
        </section>
        <div className="admin-editor-actions">
          <span className="save-message" aria-live="polite">{message}</span>
          <button className="button button--admin-secondary" type="button" onClick={onClose}>Cancelar</button>
          <button className="button button--admin-primary" type="submit"><Save size={17} aria-hidden="true" /> Guardar cambios</button>
        </div>
      </form>
    </div>
  )
}

function NewsAdmin() {
  const [composerOpen, setComposerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const { addNews, deleteNews, news, updateNews } = useClinicData()
  const editingArticle = news.find((article) => article.id === editingId)

  const openNewComposer = () => {
    setEditingId(null)
    setComposerOpen(true)
    setMessage('')
  }

  const openEditor = (id: string) => {
    setEditingId(id)
    setComposerOpen(true)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeComposer = () => {
    setComposerOpen(false)
    setEditingId(null)
  }

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`¿Eliminar la noticia “${title}”? Esta acción no se puede deshacer.`)) return
    deleteNews(id)
    if (editingId === id) closeComposer()
    setMessage('Noticia eliminada correctamente.')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const draft: NewsDraft = {
      title: String(formData.get('title')),
      excerpt: String(formData.get('excerpt')),
      body: String(formData.get('body')).split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
      category: String(formData.get('category')) as NewsCategory,
      image: String(formData.get('image')),
      published: formData.get('published') === 'on',
    }
    if (editingArticle) updateNews(editingArticle.id, draft)
    else addNews(draft)
    closeComposer()
    setMessage(
      editingArticle
        ? 'Noticia actualizada correctamente.'
        : draft.published
          ? 'Noticia publicada correctamente.'
          : 'Borrador guardado correctamente.',
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div><p>Contenido editorial</p><h1>Noticias</h1><span>Cree novedades de servicio y contenidos informativos.</span></div>
        <button className="button button--admin-primary" type="button" onClick={openNewComposer}><Plus size={17} aria-hidden="true" /> Nueva noticia</button>
      </div>
      {message && <p className="admin-success-banner" role="status"><CheckCircle2 size={18} aria-hidden="true" /> {message}</p>}
      {composerOpen && (
        <form className="admin-composer" key={editingArticle?.id ?? 'new'} onSubmit={handleSubmit}>
          <div className="admin-composer__heading"><div><span><FilePenLine size={20} aria-hidden="true" /></span><div><h2>{editingArticle ? 'Editar noticia' : 'Nueva noticia'}</h2><p>Complete el resumen y el contenido que leerán los pacientes.</p></div></div><button type="button" onClick={closeComposer} aria-label="Cerrar"><X size={20} aria-hidden="true" /></button></div>
          <label>Título<input name="title" defaultValue={editingArticle?.title} required maxLength={100} /></label>
          <div className="admin-form-grid admin-form-grid--two">
            <label>Categoría<select name="category" defaultValue={editingArticle?.category ?? 'Clínica'}><option>Clínica</option><option>Prevención</option><option>Servicios</option><option>Bienestar</option></select></label>
            <label>URL de imagen<input name="image" type="url" defaultValue={editingArticle?.image ?? 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=88'} required /></label>
          </div>
          <label>Resumen <small>Aparece en la portada y debajo del título.</small><textarea name="excerpt" rows={3} defaultValue={editingArticle?.excerpt} required maxLength={260} /></label>
          <label>Contenido <small>Separe los párrafos con una línea en blanco.</small><textarea name="body" rows={9} defaultValue={editingArticle?.body.join('\n\n')} required /></label>
          <div className="admin-composer__footer">
            <label className="admin-publish-check"><input type="checkbox" name="published" defaultChecked={editingArticle?.published ?? true} /><span>Publicada y visible</span></label>
            <div><button className="button button--admin-secondary" type="button" onClick={closeComposer}>Cancelar</button><button className="button button--admin-primary" type="submit"><Save size={17} aria-hidden="true" /> {editingArticle ? 'Guardar cambios' : 'Guardar noticia'}</button></div>
          </div>
        </form>
      )}
      <section className="admin-table-card">
        <div className="admin-table-heading"><div><h2>Todas las noticias</h2><p>{news.length} contenidos registrados</p></div></div>
        <div className="admin-news-list">
          {news.map((article) => (
            <article key={article.id}>
              <img src={article.image} alt="" />
              <div><span>{article.category}</span><h2>{article.title}</h2><p>{article.excerpt}</p><small>{dateFormatter.format(new Date(article.date))}</small></div>
              <div className="admin-list-actions">
                <em className={article.published ? 'status-published' : 'status-draft'}>{article.published ? 'Publicada' : 'Borrador'}</em>
                <button className="button button--admin-secondary" type="button" onClick={() => openEditor(article.id)}><Pencil size={15} aria-hidden="true" /> Editar</button>
                <button className="button button--admin-secondary" type="button" onClick={() => updateNews(article.id, { published: !article.published })}>{article.published ? 'Pasar a borrador' : 'Publicar'}</button>
                <button className="button button--admin-danger" type="button" onClick={() => handleDelete(article.id, article.title)}><Trash2 size={15} aria-hidden="true" /> Eliminar</button>
                {article.published && <Link to={`/noticias/${article.slug}`} target="_blank" aria-label={`Ver ${article.title}`}><ExternalLink size={17} aria-hidden="true" /></Link>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function NoticesAdmin() {
  const [composerOpen, setComposerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const { addNotice, deleteNotice, notices, updateNotice } = useClinicData()
  const editingNotice = notices.find((notice) => notice.id === editingId)

  const openNewComposer = () => {
    setEditingId(null)
    setComposerOpen(true)
    setMessage('')
  }

  const openEditor = (id: string) => {
    setEditingId(id)
    setComposerOpen(true)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeComposer = () => {
    setComposerOpen(false)
    setEditingId(null)
  }

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`¿Eliminar el aviso “${title}”? Esta acción no se puede deshacer.`)) return
    deleteNotice(id)
    if (editingId === id) closeComposer()
    setMessage('Aviso eliminado correctamente.')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const draft: NoticeDraft = {
      title: String(formData.get('title')),
      message: String(formData.get('message')),
      type: String(formData.get('type')) as NoticeType,
      ctaLabel: String(formData.get('ctaLabel')) || undefined,
      ctaUrl: String(formData.get('ctaUrl')) || undefined,
      active: formData.get('active') === 'on',
    }
    if (editingNotice) updateNotice(editingNotice.id, draft)
    else addNotice(draft)
    closeComposer()
    setMessage(editingNotice ? 'Aviso actualizado correctamente.' : 'Aviso creado correctamente.')
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div><p>Información operativa</p><h1>Avisos</h1><span>Comunique cambios de horario o información importante antes de una visita.</span></div>
        <button className="button button--admin-primary" type="button" onClick={openNewComposer}><Plus size={17} aria-hidden="true" /> Nuevo aviso</button>
      </div>
      {message && <p className="admin-success-banner" role="status"><CheckCircle2 size={18} aria-hidden="true" /> {message}</p>}
      {composerOpen && (
        <form className="admin-composer" key={editingNotice?.id ?? 'new'} onSubmit={handleSubmit}>
          <div className="admin-composer__heading"><div><span><Bell size={20} aria-hidden="true" /></span><div><h2>{editingNotice ? 'Editar aviso' : 'Nuevo aviso'}</h2><p>La información activa aparecerá en la parte superior del sitio.</p></div></div><button type="button" onClick={closeComposer} aria-label="Cerrar"><X size={20} aria-hidden="true" /></button></div>
          <div className="admin-form-grid admin-form-grid--two"><label>Título<input name="title" defaultValue={editingNotice?.title} placeholder="Ej. Horario especial" required /></label><label>Prioridad<select name="type" defaultValue={editingNotice?.type ?? 'info'}><option value="info">Informativo</option><option value="important">Importante</option></select></label></div>
          <label>Mensaje<textarea name="message" rows={3} defaultValue={editingNotice?.message} required maxLength={220} /></label>
          <div className="admin-form-grid admin-form-grid--two"><label>Texto del enlace <small>Opcional</small><input name="ctaLabel" defaultValue={editingNotice?.ctaLabel} placeholder="Ver contacto" /></label><label>Ruta del enlace <small>Opcional</small><input name="ctaUrl" defaultValue={editingNotice?.ctaUrl} placeholder="/contacto" /></label></div>
          <div className="admin-composer__footer"><label className="admin-publish-check"><input type="checkbox" name="active" defaultChecked={editingNotice?.active ?? true} /><span>Aviso activo y visible</span></label><div><button className="button button--admin-secondary" type="button" onClick={closeComposer}>Cancelar</button><button className="button button--admin-primary" type="submit"><Save size={17} aria-hidden="true" /> {editingNotice ? 'Guardar cambios' : 'Crear aviso'}</button></div></div>
        </form>
      )}
      <div className="admin-notice-list">
        {notices.map((notice) => (
          <article key={notice.id} className={notice.active ? 'active' : ''}>
            <span className={`admin-notice-list__icon admin-notice-list__icon--${notice.type}`}><Bell size={20} aria-hidden="true" /></span>
            <div><span>{notice.type === 'important' ? 'Importante' : 'Informativo'}</span><h2>{notice.title}</h2><p>{notice.message}</p><small>Actualizado: {dateFormatter.format(new Date(notice.updatedAt))}</small></div>
            <div className="admin-notice-list__actions">
              <label className="admin-active-toggle"><input type="checkbox" checked={notice.active} onChange={() => updateNotice(notice.id, { active: !notice.active })} /><span aria-hidden="true" /><em>{notice.active ? 'Activo' : 'Inactivo'}</em></label>
              <button className="button button--admin-secondary" type="button" onClick={() => openEditor(notice.id)}><Pencil size={15} aria-hidden="true" /> Editar</button>
              <button className="button button--admin-danger" type="button" onClick={() => handleDelete(notice.id, notice.title)}><Trash2 size={15} aria-hidden="true" /> Eliminar</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function SettingsAdmin() {
  const [message, setMessage] = useState('')

  const { settings, updateSettings } = useClinicData()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    updateSettings({
      phone: String(formData.get('phone')),
      whatsapp: String(formData.get('whatsapp')),
      email: String(formData.get('email')),
      address: String(formData.get('address')),
      hoursWeek: String(formData.get('hoursWeek')),
      hoursSaturday: String(formData.get('hoursSaturday')),
      emergencyNote: String(formData.get('emergencyNote')),
    })
    setMessage('Datos de la clínica actualizados correctamente.')
  }



  return (
    <div className="admin-page">
      <div className="admin-page-heading"><div><p>Configuración pública</p><h1>Datos de la clínica</h1><span>Esta información se reutiliza en el encabezado, pie de página y contacto.</span></div></div>
      <form className="admin-editor-form" key={Object.values(settings).join('|')} onSubmit={handleSubmit}>
        <section className="admin-form-card">
          <div className="admin-form-card__heading"><span>01</span><div><h2>Contacto</h2><p>Canales generales visibles para pacientes.</p></div></div>
          <div className="admin-form-grid admin-form-grid--two"><label>Teléfono<input name="phone" defaultValue={settings.phone} required /></label><label>WhatsApp<input name="whatsapp" defaultValue={settings.whatsapp} required /></label></div>
          <label>Correo electrónico<input name="email" type="email" defaultValue={settings.email} required /></label>
          <label>Dirección<input name="address" defaultValue={settings.address} required /></label>
        </section>
        <section className="admin-form-card">
          <div className="admin-form-card__heading"><span>02</span><div><h2>Horarios y emergencias</h2><p>Información operativa mostrada en todo el sitio.</p></div></div>
          <div className="admin-form-grid admin-form-grid--two"><label>Horario semanal<input name="hoursWeek" defaultValue={settings.hoursWeek} required /></label><label>Horario del sábado<input name="hoursSaturday" defaultValue={settings.hoursSaturday} required /></label></div>
          <label>Nota de emergencias<textarea name="emergencyNote" rows={3} defaultValue={settings.emergencyNote} required /></label>
        </section>
        <div className="admin-editor-actions">

          <span className="save-message" aria-live="polite">{message}</span>
          <button className="button button--admin-primary" type="submit"><Save size={17} aria-hidden="true" /> Guardar configuración</button>
        </div>
      </form>
    </div>
  )
}
