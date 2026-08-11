import {
  ArrowRight,
  Building2,
  CalendarDays,
  Car,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
} from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { CLINIC_DIRECTIONS_URL, ClinicMap } from '../components/ClinicMap'
import { useClinicData } from '../context/ClinicDataContext'
import { phoneHref, whatsappHref } from '../lib/contact'

export function ContactPage() {
  const { settings } = useClinicData()

  return (
    <>
      <section className="contact-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Contacto' }]} />
          <div className="contact-hero__grid">
            <div>
              <p className="eyebrow">Contacto y citas</p>
              <h1>Estamos aquí para orientarle.</h1>
              <p>Elija el canal que prefiera o envíe una solicitud. Nuestro equipo le responderá dentro del horario de atención.</p>
            </div>
            <div className="contact-hero__hours">
              <Clock3 size={23} aria-hidden="true" />
              <div>
                <strong>Horario de atención</strong>
                <span>{settings.hoursWeek}</span>
                <span>{settings.hoursSaturday}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-options">
        <div className="container contact-options__grid">
          <a href={phoneHref(settings.phone)}>
            <span><Phone size={23} aria-hidden="true" /></span>
            <small>Llámenos</small>
            <strong>{settings.phone}</strong>
            <em>Atención en horario de la clínica <ArrowRight size={16} aria-hidden="true" /></em>
          </a>
          <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer">
            <span><MessageCircle size={23} aria-hidden="true" /></span>
            <small>Escríbanos por WhatsApp</small>
            <strong>{settings.whatsapp}</strong>
            <em>Abrir conversación <ArrowRight size={16} aria-hidden="true" /></em>
          </a>
          <a href={`mailto:${settings.email}`}>
            <span><Mail size={23} aria-hidden="true" /></span>
            <small>Correo electrónico</small>
            <strong>{settings.email}</strong>
            <em>Enviar correo <ArrowRight size={16} aria-hidden="true" /></em>
          </a>
        </div>
      </section>



      <section className="location-section" id="ubicacion">
        <div className="container location-section__grid">
          <ClinicMap className="contact-map-embed" />
          <div className="location-details">
            <p className="eyebrow">Ubicación</p>
            <h2>Planee su visita</h2>
            <div className="location-address">
              <Building2 size={22} aria-hidden="true" />
              <div><strong>{settings.address}</strong><span>Esperanza, Valverde</span></div>
            </div>
            <a
              className="button button--secondary"
              href={CLINIC_DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Abrir en Google Maps <ArrowRight size={17} aria-hidden="true" />
            </a>
            <div className="arrival-options">
              <div><Car size={21} aria-hidden="true" /><span><strong>Cómo llegar</strong>Utilice el mapa para calcular la ruta desde su ubicación.</span></div>
              <div><Phone size={21} aria-hidden="true" /><span><strong>¿Necesita orientación?</strong>Llame al {settings.phone} antes de salir.</span></div>
              <div><CalendarDays size={21} aria-hidden="true" /><span><strong>Antes de llegar</strong>Confirme el edificio, piso y consultorio en su cita.</span></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
