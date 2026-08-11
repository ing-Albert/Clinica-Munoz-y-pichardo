import { ArrowRight, HelpCircle, Search } from 'lucide-react'
import { useDeferredValue, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SpecialtyCard } from '../components/SpecialtyCard'
import { useClinicData } from '../context/ClinicDataContext'

export function SpecialtiesPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const { specialties } = useClinicData()
  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase('es')
  const filteredSpecialties = specialties.filter((specialty) =>
    `${specialty.name} ${specialty.shortDescription} ${specialty.services.join(' ')}`
      .toLocaleLowerCase('es')
      .includes(normalizedQuery),
  )

  return (
    <>
      <section className="page-hero page-hero--directory">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Especialidades' }]} />
          <div className="page-hero__grid">
            <div>
              <p className="eyebrow">Servicios médicos</p>
              <h1>Especialidades para cuidar su salud de forma integral.</h1>
              <p>
                Conozca qué atendemos, qué servicios ofrecemos y los profesionales disponibles en cada área.
              </p>
            </div>
            <div className="directory-search">
              <label htmlFor="specialty-search">¿Qué atención está buscando?</label>
              <div>
                <Search size={20} aria-hidden="true" />
                <input
                  id="specialty-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ej. cardiología o tiroides"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section directory-section">
        <div className="container">
          <div className="results-summary" aria-live="polite">
            <strong>{filteredSpecialties.length}</strong>{' '}
            {filteredSpecialties.length === 1 ? 'especialidad encontrada' : 'especialidades encontradas'}
          </div>
          {filteredSpecialties.length > 0 ? (
            <div className="specialties-grid specialties-grid--directory">
              {filteredSpecialties.map((specialty, index) => (
                <SpecialtyCard key={specialty.id} specialty={specialty} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={30} aria-hidden="true" />
              <h2>No encontramos esa especialidad</h2>
              <p>Pruebe con otro término o solicite orientación a nuestro equipo.</p>
              <Link className="button button--primary" to="/contacto?motivo=orientacion">
                Solicitar orientación
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="guidance-card-section">
        <div className="container">
          <div className="guidance-card">
            <span className="guidance-card__icon"><HelpCircle size={27} aria-hidden="true" /></span>
            <div>
              <p className="eyebrow">Podemos ayudarle</p>
              <h2>¿No está seguro de cuál especialidad necesita?</h2>
              <p>Cuéntenos brevemente qué tipo de orientación busca, sin incluir información médica sensible.</p>
            </div>
            <Link className="button button--primary" to="/contacto?motivo=orientacion">
              Hablar con el equipo <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
