import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Clock3,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Stethoscope,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { DoctorCard } from '../components/DoctorCard'
import { useClinicData } from '../context/ClinicDataContext'
import { phoneHref, whatsappHref } from '../lib/contact'

export function DoctorProfilePage() {
  const { slug } = useParams()
  const { doctors, settings, specialties } = useClinicData()
  const doctor = doctors.find((item) => item.slug === slug)

  if (!doctor) {
    return (
      <section className="section">
        <div className="container empty-state">
          <Stethoscope size={34} aria-hidden="true" />
          <h1>Perfil médico no encontrado</h1>
          <p>El profesional que busca no está disponible o su perfil cambió de dirección.</p>
          <Link className="button button--primary" to="/medicos">Volver al directorio</Link>
        </div>
      </section>
    )
  }

  const doctorSpecialties = doctor.specialtyIds
    .map((id) => specialties.find((specialty) => specialty.id === id))
    .filter((specialty) => specialty !== undefined)
  const relatedDoctors = doctors
    .filter(
      (candidate) =>
        candidate.id !== doctor.id &&
        candidate.specialtyIds.some((id) => doctor.specialtyIds.includes(id)),
    )
    .slice(0, 3)
  const availabilityLabel = doctor.availabilityLabel
    ?? (doctor.acceptingAppointments ? 'Acepta nuevos pacientes' : 'Lista de espera disponible')

  return (
    <>
      <section className="profile-hero">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Inicio', to: '/' },
              { label: 'Equipo médico', to: '/medicos' },
              { label: doctor.name },
            ]}
          />
          <Link className="profile-back-link" to="/medicos">
            <ArrowLeft size={17} aria-hidden="true" /> Volver al directorio
          </Link>
          <div className="profile-hero__grid">
            <div className="profile-photo">
              <img
                src={doctor.image}
                alt={doctor.imageIsPlaceholder ? '' : `Retrato de ${doctor.name}`}
                style={{ objectPosition: doctor.imagePosition }}
              />
            </div>
            <div className="profile-intro">
              <div className={`availability availability--inline${doctor.availabilityLabel ? ' availability--neutral' : doctor.acceptingAppointments ? '' : ' availability--wait'}`}>
                <span aria-hidden="true" />
                {availabilityLabel}
              </div>
              <p className="profile-intro__specialty">
                {doctorSpecialties.map((specialty) => specialty.name).join(' · ')}
              </p>
              <h1>{doctor.name}</h1>
              <p className="profile-intro__role">{doctor.role}</p>
              <div className="focus-tags" aria-label="Áreas de enfoque">
                {doctor.focus.map((item) => <span key={item}>{item}</span>)}
              </div>
              <div className="profile-intro__actions">
                <a className="button button--primary" href={whatsappHref(doctor.phone)} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} aria-hidden="true" /> Escribir por WhatsApp
                </a>
                <a className="button button--secondary" href={phoneHref(doctor.phone)}>
                  <Phone size={18} aria-hidden="true" /> Llamar al consultorio
                </a>
              </div>
              <p className="next-available"><Clock3 size={17} aria-hidden="true" /> {doctor.nextAvailable}</p>
            </div>

            <aside className="location-card" aria-labelledby="location-card-title">
              <div className="location-card__heading">
                <span><MapPin size={21} aria-hidden="true" /></span>
                <div>
                  <p>Dónde encontrarle</p>
                  <h2 id="location-card-title">{doctor.building}</h2>
                </div>
              </div>
              <div className="location-card__numbers">
                <div><small>Piso</small><strong>{doctor.floor.replace(/^Piso\s*/i, '')}</strong></div>
                <div><small>Consultorio</small><strong>{doctor.office.replace(/^Consultorio\s*/i, '')}</strong></div>
              </div>
              <dl>
                <div><dt><Building2 size={17} aria-hidden="true" /> Dirección</dt><dd>{settings.address}</dd></div>
                <div><dt><Clock3 size={17} aria-hidden="true" /> Horario</dt><dd>{doctor.schedule}</dd></div>
                <div><dt><Phone size={17} aria-hidden="true" /> Teléfono</dt><dd><a href={phoneHref(doctor.phone)}>{doctor.phone}</a></dd></div>
                <div><dt><Mail size={17} aria-hidden="true" /> Correo</dt><dd><a href={`mailto:${doctor.email}`}>{doctor.email}</a></dd></div>
              </dl>
              <Link className="location-card__directions" to="/contacto#ubicacion">
                Ver indicaciones para llegar <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="section profile-content">
        <div className="container profile-content__grid">
          <article className="profile-biography">
            <p className="eyebrow">Perfil profesional</p>
            <h2>Sobre {doctor.name.replace(/^(Dra?\.)\s/, '')}</h2>
            <p className="profile-biography__lead">{doctor.bio}</p>

            <div className="profile-detail-block">
              <span className="profile-detail-block__icon"><Award size={23} aria-hidden="true" /></span>
              <div>
                <h3>Formación y trayectoria</h3>
                <ul>
                  {doctor.education.map((item) => (
                    <li key={item}><CheckCircle2 size={17} aria-hidden="true" /> {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="profile-detail-block">
              <span className="profile-detail-block__icon"><Languages size={23} aria-hidden="true" /></span>
              <div>
                <h3>Idiomas de atención</h3>
                <p>{doctor.languages.join(' · ')}</p>
              </div>
            </div>
          </article>

          <aside className="profile-appointment-card">
            <p className="eyebrow">Solicitar una cita</p>
            <h2>¿Desea atenderse con {doctor.name}?</h2>
            <p>Envíe su solicitud y nuestro equipo confirmará la fecha y el horario disponibles.</p>
            <Link className="button button--light" to={`/contacto?motivo=cita&medico=${doctor.slug}`}>
              Consultar disponibilidad <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <span>No envíe información médica sensible mediante el formulario general.</span>
          </aside>
        </div>
      </section>

      {relatedDoctors.length > 0 && (
        <section className="section related-doctors">
          <div className="container">
            <div className="section-heading">
              <div className="section-heading__copy">
                <p className="eyebrow">También puede consultar</p>
                <h2>Profesionales relacionados</h2>
              </div>
              <div className="section-heading__action">
                <Link className="button button--secondary" to="/medicos">Ver todo el equipo</Link>
              </div>
            </div>
            <div className="doctors-grid doctors-grid--three">
              {relatedDoctors.map((candidate) => <DoctorCard key={candidate.id} doctor={candidate} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
