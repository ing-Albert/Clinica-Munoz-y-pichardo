import { Filter, Search, Stethoscope, X } from 'lucide-react'
import { useDeferredValue } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { DoctorCard } from '../components/DoctorCard'
import { useClinicData } from '../context/ClinicDataContext'

export function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { doctors, specialties } = useClinicData()
  const query = searchParams.get('buscar') ?? ''
  const specialtyId = searchParams.get('especialidad') ?? 'todas'
  const availableOnly = searchParams.get('disponibles') === 'true'
  const deferredQuery = useDeferredValue(query)

  const setFilter = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (value && value !== 'todas') next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase('es')
  const filteredDoctors = doctors.filter((doctor) => {
    const specialtyNames = doctor.specialtyIds
      .map((id) => specialties.find((specialty) => specialty.id === id)?.name ?? '')
      .join(' ')
    const matchesQuery = `${doctor.name} ${doctor.role} ${doctor.focus.join(' ')} ${specialtyNames}`
      .toLocaleLowerCase('es')
      .includes(normalizedQuery)
    const matchesSpecialty = specialtyId === 'todas' || doctor.specialtyIds.includes(specialtyId)
    const matchesAvailability = !availableOnly || (doctor.acceptingAppointments && !doctor.availabilityLabel)
    return matchesQuery && matchesSpecialty && matchesAvailability
  })

  const hasFilters = Boolean(query || specialtyId !== 'todas' || availableOnly)

  return (
    <>
      <section className="page-hero page-hero--directory doctors-directory-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Equipo médico' }]} />
          <div className="page-hero__grid">
            <div>
              <p className="eyebrow">Directorio médico</p>
              <h1>Encuentre al profesional indicado para usted.</h1>
              <p>Consulte su experiencia, áreas de atención, horario y ubicación antes de solicitar una cita.</p>
            </div>
            <div className="directory-search">
              <label htmlFor="doctor-search">Buscar en el equipo médico</label>
              <div>
                <Search size={20} aria-hidden="true" />
                <input
                  id="doctor-search"
                  type="search"
                  value={query}
                  onChange={(event) => setFilter('buscar', event.target.value || null)}
                  placeholder="Nombre, especialidad o área de enfoque"
                />
                {query && (
                  <button type="button" onClick={() => setFilter('buscar', null)} aria-label="Limpiar búsqueda">
                    <X size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section directory-section doctors-directory">
        <div className="container">
          <div className="doctor-filters" aria-label="Filtros del directorio">
            <span className="doctor-filters__label"><Filter size={17} aria-hidden="true" /> Filtrar por</span>
            <label>
              <span className="sr-only">Especialidad</span>
              <select value={specialtyId} onChange={(event) => setFilter('especialidad', event.target.value)}>
                <option value="todas">Todas las especialidades</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
                ))}
              </select>
            </label>
            <label className="toggle-filter">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => setFilter('disponibles', event.target.checked ? 'true' : null)}
              />
              <span aria-hidden="true" />
              Solo con citas disponibles
            </label>
            {hasFilters && (
              <button className="clear-filters" type="button" onClick={() => setSearchParams({}, { replace: true })}>
                Limpiar filtros <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="results-summary" aria-live="polite">
            <strong>{filteredDoctors.length}</strong>{' '}
            {filteredDoctors.length === 1 ? 'profesional encontrado' : 'profesionales encontrados'}
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="doctors-grid doctors-grid--directory">
              {filteredDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
            </div>
          ) : (
            <div className="empty-state">
              <Stethoscope size={34} aria-hidden="true" />
              <h2>No encontramos profesionales con esos filtros</h2>
              <p>Amplíe la búsqueda o permita que nuestro equipo le oriente.</p>
              <button className="button button--secondary" type="button" onClick={() => setSearchParams({}, { replace: true })}>
                Limpiar filtros
              </button>
              <Link className="text-link" to="/contacto?motivo=orientacion">Solicitar orientación</Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
