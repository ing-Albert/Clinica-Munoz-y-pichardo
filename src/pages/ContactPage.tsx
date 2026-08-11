import {
  ArrowRight,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { CLINIC_DIRECTIONS_URL, ClinicMap } from '../components/ClinicMap'
import { useClinicData } from '../context/ClinicDataContext'
import { phoneHref, whatsappHref } from '../lib/contact'

export function ContactPage() {
  const [searchParams] = useSearchParams()
  const [submittedFor, setSubmittedFor] = useState<string | null>(null)
  const { doctors, settings, specialties } = useClinicData()
  const requestKey = searchParams.toString()
  const submitted = submittedFor === requestKey
  const requestedReason = searchParams.get('motivo') ?? 'cita'
  const requestedDoctor = searchParams.get('medico') ?? ''
  const requestedSpecialty = searchParams.get('especialidad') ?? ''

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmittedFor(requestKey)
  }

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
            <small>Correo de citas</small>
            <strong>{settings.email}</strong>
            <em>Enviar correo <ArrowRight size={16} aria-hidden="true" /></em>
          </a>
        </div>
      </section>

      <section className="section request-section">
        <div className="container request-section__grid">
          <div className="request-section__intro">
            <p className="eyebrow">Solicitud en línea</p>
            <h2>Cuéntenos cómo podemos ayudarle.</h2>
            <p>Este formulario inicia una solicitud. La cita queda confirmada cuando nuestro equipo se comunica con usted.</p>
          </div>

          <div className="request-form-card">
            {submitted ? (
              <div className="form-success" role="status">
                <span><CheckCircle2 size={34} aria-hidden="true" /></span>
                <p className="eyebrow">Solicitud recibida</p>
                <h2>Gracias por contactarnos.</h2>
                <p>En este prototipo la solicitud no se envía a un servidor. El flujo visual está listo para conectar el servicio real de citas.</p>
                <button className="button button--secondary" type="button" onClick={() => setSubmittedFor(null)}>
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form className="request-form" onSubmit={handleSubmit}>
                <div className="form-row form-row--two">
                  <label>
                    Nombre y apellido <span aria-hidden="true">*</span>
                    <input type="text" name="name" autoComplete="name" required />
                  </label>
                  <label>
                    Teléfono <span aria-hidden="true">*</span>
                    <input type="tel" name="phone" autoComplete="tel" required />
                  </label>
                </div>
                <div className="form-row form-row--two">
                  <label>
                    Correo electrónico <span aria-hidden="true">*</span>
                    <input type="email" name="email" autoComplete="email" required />
                  </label>
                  <label>
                    Motivo de contacto <span aria-hidden="true">*</span>
                    <select key={`reason-${requestedReason}`} name="reason" defaultValue={requestedReason} required>
                      <option value="cita">Solicitar una cita</option>
                      <option value="orientacion">Orientación de especialidad</option>
                      <option value="informacion">Información general</option>
                      <option value="otro">Otro motivo</option>
                    </select>
                  </label>
                </div>
                <div className="form-row form-row--two">
                  <label>
                    Especialidad
                    <select key={`specialty-${requestedSpecialty}`} name="specialty" defaultValue={requestedSpecialty}>
                      <option value="">Seleccione una opción</option>
                      {specialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.slug}>{specialty.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Profesional de preferencia
                    <select key={`doctor-${requestedDoctor}`} name="doctor" defaultValue={requestedDoctor}>
                      <option value="">Sin preferencia</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.slug}>{doctor.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  ¿Cómo prefiere que le contactemos?
                  <select name="contactMethod" defaultValue="telefono">
                    <option value="telefono">Llamada telefónica</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="correo">Correo electrónico</option>
                  </select>
                </label>
                <label>
                  Mensaje breve <span className="optional">Opcional</span>
                  <textarea name="message" rows={4} placeholder="Ej. Prefiero una cita por la mañana." />
                </label>
                <label className="consent-field">
                  <input type="checkbox" required />
                  <span>Acepto que la clínica utilice estos datos para responder a mi solicitud. <span aria-hidden="true">*</span></span>
                </label>
                <button className="button button--primary button--full" type="submit">
                  Enviar solicitud <Send size={17} aria-hidden="true" />
                </button>
                <p className="required-note">* Campos obligatorios</p>
              </form>
            )}
          </div>
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
