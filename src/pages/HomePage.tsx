import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ExternalLink,
  FlaskConical,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Radiation,
  ScanLine,
  Scissors,
  Search,
  ShieldCheck,
  Siren,
  Snowflake,
  Stethoscope,
  Waves,
  BookOpenText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import arsImage from '../ars.png'
import { CLINIC_DIRECTIONS_URL, ClinicMap } from '../components/ClinicMap'
import { NewsCard } from '../components/NewsCard'
import { SectionHeading } from '../components/SectionHeading'
import { SpecialtyCard } from '../components/SpecialtyCard'
import { useClinicData } from '../context/ClinicDataContext'
import { affiliatedInsurers, generalServices } from '../data/officialClinic'
import { phoneHref, whatsappHref } from '../lib/contact'

const serviceIcons: Record<string, LucideIcon> = {
  Laboratorio: FlaskConical,
  Colposcopía: ScanLine,
  Crioterapia: Snowflake,
  Sonografía: Waves,
  'Rayos X': Radiation,
  'Emergencias 24 horas': Siren,
  'Cirugías y partos': Scissors,
  Internamientos: BedDouble,
}

export function HomePage() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { news, settings, specialties } = useClinicData()
  const publishedNews = news.filter((article) => article.published).slice(0, 3)

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/medicos?buscar=${encodeURIComponent(query)}` : '/medicos')
  }

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__grid">
          <div className="home-hero__copy">
            <p className="eyebrow">Cuidado que empieza por escuchar</p>
            <h1>
              Medicina clara,
              <span>cercana a usted.</span>
            </h1>
            <p className="home-hero__lead">
              Especialistas que trabajan en conjunto para ofrecerle orientación precisa y una atención verdaderamente personal.
            </p>

            <form className="provider-search" onSubmit={handleSearch} role="search">
              <label className="sr-only" htmlFor="home-search">
                Buscar médico o especialidad
              </label>
              <Search size={20} aria-hidden="true" />
              <input
                id="home-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Busque por médico o especialidad"
              />
              <button type="submit" aria-label="Buscar">
                Buscar
              </button>
            </form>
            <div className="popular-searches">
              <span>Más buscado:</span>
              <Link to="/especialidades/cardiologia">Cardiología</Link>
              <Link to="/especialidades/pediatria">Pediatría</Link>
              <Link to="/especialidades/medicina-interna">Medicina interna</Link>
            </div>
          </div>

          <div className="home-hero__visual">
            <div className="hero-architecture" aria-hidden="true" />
            <figure className="hero-photo">
              <img
                src="https://images.unsplash.com/photo-1674049406176-021807a2802e?auto=format&fit=crop&w=1200&q=90"
                alt="Médica conversando con una paciente durante una consulta"
              />
            </figure>
            <div className="hero-availability-card">
              <span className="hero-availability-card__icon">
                <CalendarDays size={21} aria-hidden="true" />
              </span>
              <div>
                <small>Atención y orientación</small>
                <strong>Comuníquese con recepción</strong>
                <Link to="/contacto">
                  Ver teléfonos <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="hero-trust-note">
              <ShieldCheck size={20} aria-hidden="true" />
              <span>Emergencias 24 horas</span>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-actions" aria-label="Acciones rápidas">
        <div className="container quick-actions__grid">
          <Link to="/especialidades" className="quick-action">
            <span className="quick-action__icon"><BookOpenText size={23} aria-hidden="true" /></span>
            <span><strong>Especialidades</strong><small>Conozca nuestros servicios</small></span>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
          <Link to="/medicos" className="quick-action">
            <span className="quick-action__icon"><Stethoscope size={23} aria-hidden="true" /></span>
            <span><strong>Encontrar un médico</strong><small>Conozca al equipo y sus horarios</small></span>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
          <Link to="/contacto" className="quick-action">
            <span className="quick-action__icon"><MapPin size={23} aria-hidden="true" /></span>
            <span><strong>Cómo llegar</strong><small>Ubicación, pisos y consultorios</small></span>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section specialties-preview">
        <div className="container">
          <SectionHeading
            eyebrow="Especialidades"
            title="La atención que necesita, en un mismo lugar"
            description="Explore nuestros servicios y encuentre al profesional indicado para acompañar su salud."
            action={<Link className="button button--secondary" to="/especialidades">Ver todas</Link>}
          />
          <div className="specialties-grid">
            {specialties.filter((specialty) => specialty.featured).map((specialty, index) => (
              <SpecialtyCard key={specialty.id} specialty={specialty} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section general-services-section">
        <div className="container">
          <SectionHeading
            eyebrow="Servicios generales"
            title="Apoyo diagnóstico y atención en un mismo centro"
            description="Consulte con recepción la disponibilidad y preparación necesaria para cada servicio."
          />
          <div className="general-services-grid">
            {generalServices.map((service, index) => {
              const ServiceIcon = serviceIcons[service] ?? Stethoscope
              const isEmergency = service === 'Emergencias 24 horas'

              return (
                <article
                  className={`general-service-card general-service-card--${index % 2 === 0 ? 'blue' : 'green'}${isEmergency ? ' general-service-card--emergency' : ''}`}
                  key={service}
                >
                  <span className="general-service-card__number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="general-service-card__icon">
                    <ServiceIcon size={28} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div className="general-service-card__body">
                    <small>{isEmergency ? 'Atención continua' : 'Servicio del centro'}</small>
                    <strong>{service}</strong>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section care-section">
        <div className="container care-section__grid">
          <div className="care-section__visual">
            <div className="care-photo care-photo--main">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=88"
                alt="Profesional médico revisando información clínica"
                loading="lazy"
              />
            </div>
            <div className="wayfinding-card">
              <div className="wayfinding-card__top">
                <span>Su visita, sin confusiones</span>
                <MapPin size={19} aria-hidden="true" />
              </div>
              <strong>Centro Médico Muñoz &amp; Pichardo</strong>
              <div>
                <span><b>24h</b>Emergencias</span>
                <span><b>#44</b>Av. María T. Sánchez</span>
              </div>
            </div>
          </div>
          <div className="care-section__copy">
            <p className="eyebrow">Una experiencia más humana</p>
            <h2>Su salud merece tiempo, contexto y respuestas claras.</h2>
            <p>
              Reunimos atención especializada, servicios diagnósticos y orientación en una ubicación accesible en Esperanza.
            </p>
            <ul className="check-list">
              <li><Check size={18} aria-hidden="true" /> Equipo médico organizado por especialidad</li>
              <li><Check size={18} aria-hidden="true" /> Laboratorio, imágenes y servicios quirúrgicos</li>
              <li><Check size={18} aria-hidden="true" /> Servicio de emergencias disponible las 24 horas</li>
            </ul>
            <Link className="button button--primary" to="/clinica">
              Conocer la clínica <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section insurance-section">
        <div className="insurance-panel__copy">
          <p className="eyebrow eyebrow--light">Cobertura médica</p>
          <h2>Seguros médicos afiliados</h2>
          <p>Trabajamos con distintas administradoras de riesgos de salud. Confirme la cobertura de su plan antes de la consulta.</p>
          <div className="insurance-panel__summary">
            <span><ShieldCheck size={25} aria-hidden="true" /></span>
            <div>
              <strong>{affiliatedInsurers.length} entidades afiliadas</strong>
              <small>Consulte las condiciones de su plan.</small>
            </div>
          </div>
          <figure className="insurance-panel__logos">
            <div className="insurance-panel__visual-heading">
              <div>
                <small>Red de cobertura</small>
                <strong>Administradoras aceptadas</strong>
              </div>
              <span>{affiliatedInsurers.length} afiliadas</span>
            </div>
            <div className="insurance-panel__image-frame">
              <img src={arsImage} alt="" loading="lazy" />
            </div>
            <ul className="sr-only" aria-label="Seguros médicos afiliados">
              {affiliatedInsurers.map((insurer) => <li key={insurer}>{insurer}</li>)}
            </ul>
            <figcaption><ShieldCheck size={16} aria-hidden="true" /> La aceptación está sujeta al plan y al servicio solicitado.</figcaption>
          </figure>
        </div>
      </section>

      {publishedNews.length > 0 && (
        <section className="section news-preview">
          <div className="container">
            <SectionHeading
              eyebrow="Actualidad"
              title="Información para cuidar su salud"
              description="Noticias del centro, novedades de servicio y orientación para pacientes."
              action={<Link className="button button--secondary" to="/noticias">Ver publicaciones</Link>}
            />
            <div className="news-grid">
              {publishedNews.map((article, index) => (
                <NewsCard key={article.id} article={article} featured={index === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section home-location-section" id="ubicacion">
        <div className="container">
          <SectionHeading
            eyebrow="Cómo llegar"
            title="Visítenos en el centro de Esperanza"
            description={settings.address}
          />
          <div className="home-location-card">
            <ClinicMap />
            <aside>
              <span className="home-location-card__icon"><MapPin size={24} aria-hidden="true" /></span>
              <h3>{settings.clinicName}</h3>
              <p>{settings.address}</p>
              <div className="home-location-card__contacts">
                <a href={phoneHref(settings.phone)}><Phone size={17} aria-hidden="true" /><span><small>Teléfono</small>{settings.phone}</span></a>
                <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={17} aria-hidden="true" /><span><small>WhatsApp</small>{settings.whatsapp}</span></a>
                <a href={`mailto:${settings.email}`}><Mail size={17} aria-hidden="true" /><span><small>Correo</small>{settings.email}</span></a>
              </div>
              <a className="button button--primary" href={CLINIC_DIRECTIONS_URL} target="_blank" rel="noreferrer">Cómo llegar <ExternalLink size={16} aria-hidden="true" /></a>
            </aside>
          </div>
        </div>
      </section>

    </>
  )
}
