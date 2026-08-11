import { ArrowRight, CalendarDays, Check, ChevronRight, Stethoscope } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { DoctorCard } from '../components/DoctorCard'
import { SpecialtyIcon } from '../components/SpecialtyIcon'
import { useClinicData } from '../context/ClinicDataContext'

export function SpecialtyPage() {
  const { slug } = useParams()
  const { doctors, news, specialties } = useClinicData()
  const specialty = specialties.find((item) => item.slug === slug)

  if (!specialty) {
    return (
      <section className="section">
        <div className="container empty-state">
          <Stethoscope size={34} aria-hidden="true" />
          <h1>Especialidad no encontrada</h1>
          <p>La información que busca no está disponible o cambió de dirección.</p>
          <Link className="button button--primary" to="/especialidades">Ver especialidades</Link>
        </div>
      </section>
    )
  }

  const specialtyDoctors = doctors.filter((doctor) => doctor.specialtyIds.includes(specialty.id))
  const consultationGuide = news.find(
    (article) => article.slug === 'como-preparar-su-consulta' && article.published,
  )

  return (
    <>
      <section className="specialty-hero">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Inicio', to: '/' },
              { label: 'Especialidades', to: '/especialidades' },
              { label: specialty.name },
            ]}
          />
          <div className="specialty-hero__grid">
            <div className="specialty-hero__icon">
              <SpecialtyIcon name={specialty.icon} size={42} />
            </div>
            <div>
              <p className="eyebrow">Especialidad médica</p>
              <h1>{specialty.name}</h1>
              <p>{specialty.description}</p>
            </div>
            <div className="specialty-hero__action">
              <span>{specialtyDoctors.length} profesionales en esta especialidad</span>
              <Link className="button button--primary" to={`/contacto?motivo=cita&especialidad=${specialty.slug}`}>
                <CalendarDays size={18} aria-hidden="true" /> Solicitar cita
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section specialty-content">
        <div className="container specialty-content__grid">
          <div>
            <p className="eyebrow">Cómo podemos ayudarle</p>
            <h2>Servicios de {specialty.name.toLocaleLowerCase('es')}</h2>
            <p className="specialty-content__intro">
              Cada consulta comienza con una valoración individual. Estos son algunos de los servicios más habituales del área.
            </p>
            <ul className="service-list">
              {specialty.services.map((service) => (
                <li key={service}><Check size={19} aria-hidden="true" /> {service}</li>
              ))}
            </ul>
          </div>
          <aside className="prepare-card">
            <span className="prepare-card__number">Antes de su consulta</span>
            <h3>Prepárese para aprovechar mejor su visita</h3>
            <ul>
              <li><span>01</span>Lleve una lista de medicamentos actuales.</li>
              <li><span>02</span>Anote sus preguntas principales.</li>
              <li><span>03</span>Traiga estudios anteriores relacionados.</li>
            </ul>
            <Link to={consultationGuide ? `/noticias/${consultationGuide.slug}` : '/noticias'}>
              {consultationGuide ? 'Ver guía completa' : 'Ver consejos de salud'} <ChevronRight size={17} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="section specialty-doctors">
        <div className="container">
          <div className="section-heading">
            <div className="section-heading__copy">
              <p className="eyebrow">Profesionales del área</p>
              <h2>Equipo de {specialty.name}</h2>
              <p>Revise perfiles, áreas de enfoque, horarios y ubicación de consultorio.</p>
            </div>
          </div>
          {specialtyDoctors.length > 0 ? (
            <div className="doctors-grid">
              {specialtyDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
            </div>
          ) : (
            <p>Actualmente no hay profesionales publicados en esta especialidad.</p>
          )}
        </div>
      </section>

      <section className="simple-cta">
        <div className="container simple-cta__inner">
          <div>
            <p className="eyebrow eyebrow--light">Siguiente paso</p>
            <h2>Solicite una cita con el equipo de {specialty.name}.</h2>
          </div>
          <Link className="button button--light" to={`/contacto?motivo=cita&especialidad=${specialty.slug}`}>
            Consultar disponibilidad <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
