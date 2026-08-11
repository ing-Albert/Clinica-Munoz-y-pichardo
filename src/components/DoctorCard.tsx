import { ArrowRight, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useClinicData } from '../context/ClinicDataContext'
import placeholderImg from '../assets/doctor-placeholder.svg'
import { whatsappHref } from '../lib/contact'
import type { Doctor } from '../types'

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const { specialties } = useClinicData()
  const specialtyNames = doctor.specialtyIds
    .map((id) => specialties.find((specialty) => specialty.id === id)?.name)
    .filter(Boolean)
    .join(' · ')
  const availabilityLabel = doctor.availabilityLabel
    ?? (doctor.acceptingAppointments ? 'Recibe pacientes' : 'Lista de espera')

  const waMessage = encodeURIComponent(`Hola, me gustaría agendar una cita con ${doctor.name}.`)
  const waLink = `${whatsappHref(doctor.phone)}?text=${waMessage}`

  return (
    <article className="doctor-card">
      <Link className="doctor-card__image" to={`/medicos/${doctor.slug}`} tabIndex={-1} aria-hidden="true">
        <img
          src={doctor.image || placeholderImg}
          alt=""
          style={{ objectPosition: doctor.imagePosition }}
          loading="lazy"
        />
        <span className={`availability${doctor.availabilityLabel ? ' availability--neutral' : doctor.acceptingAppointments ? '' : ' availability--wait'}`}>
          <span aria-hidden="true" />
          {availabilityLabel}
        </span>
      </Link>
      <div className="doctor-card__body">
        <p className="doctor-card__specialty">{specialtyNames}</p>
        <h3>
          <Link to={`/medicos/${doctor.slug}`}>{doctor.name}</Link>
        </h3>
        <p className="doctor-card__role">{doctor.role}</p>
        <div className="doctor-card__location">
          <MapPin size={17} aria-hidden="true" />
          <span>
            {doctor.floor} · {doctor.office}
          </span>
        </div>
        <div className="doctor-card__actions">
          <a className="button button--primary doctor-card__whatsapp" href={waLink} target="_blank" rel="noreferrer" aria-label={`Escribir por WhatsApp a ${doctor.name}`}>
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp
          </a>
          <Link className="text-link" to={`/medicos/${doctor.slug}`}>
            Ver perfil <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
