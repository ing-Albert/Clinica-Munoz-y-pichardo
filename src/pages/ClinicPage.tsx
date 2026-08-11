import { ArrowRight, Check, HeartHandshake, ShieldCheck, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { useClinicData } from '../context/ClinicDataContext'

export function ClinicPage() {
  const { doctors, settings, specialties } = useClinicData()

  return (
    <>
      <section className="clinic-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'La clínica' }]} />
          <div className="clinic-hero__grid">
            <div className="clinic-hero__copy">
              <p className="eyebrow">{settings.clinicName}</p>
              <h1>La medicina es más efectiva cuando también se siente cercana.</h1>
              <p>
                Reunimos especialistas comprometidos con una atención coordinada, comprensible y respetuosa del tiempo de cada paciente.
              </p>
              <Link className="button button--primary" to="/medicos">
                Conocer al equipo <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="clinic-hero__visual">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=88"
                alt="Interior luminoso de una clínica moderna"
              />
              <div className="clinic-hero__quote">
                <span>“</span>
                <p>Escuchar bien también forma parte del diagnóstico.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section clinic-story">
        <div className="container clinic-story__grid">
          <div>
            <p className="eyebrow">Nuestra forma de cuidar</p>
            <h2>Información clara antes, durante y después de cada visita.</h2>
          </div>
          <div className="clinic-story__body">
            <p>
              Queremos que cada persona llegue a su consulta sabiendo a dónde ir y con quién se atenderá. Por eso hacemos visibles los datos prácticos que suelen quedar escondidos: ubicación, piso, consultorio, horario y canales de contacto.
            </p>
            <p>
              Nuestro modelo promueve la comunicación entre profesionales y la participación informada del paciente. No se trata solo de atender una condición, sino de comprender su contexto.
            </p>
          </div>
        </div>
      </section>

      <section className="clinic-values">
        <div className="container clinic-values__grid">
          <article>
            <span><HeartHandshake size={27} aria-hidden="true" /></span>
            <small>01</small>
            <h2>Cercanía</h2>
            <p>Escuchamos primero y explicamos cada paso en un lenguaje comprensible.</p>
          </article>
          <article>
            <span><UsersRound size={27} aria-hidden="true" /></span>
            <small>02</small>
            <h2>Coordinación</h2>
            <p>Conectamos especialidades para ofrecer una mirada más completa de su salud.</p>
          </article>
          <article>
            <span><ShieldCheck size={27} aria-hidden="true" /></span>
            <small>03</small>
            <h2>Confianza</h2>
            <p>Protegemos su privacidad y promovemos decisiones clínicas informadas.</p>
          </article>
        </div>
      </section>

      <section className="section clinic-experience">
        <div className="container clinic-experience__grid">
          <div className="clinic-experience__image">
            <img
              src="https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1100&q=88"
              alt="Espacio de espera cómodo y accesible"
              loading="lazy"
            />
            <div aria-hidden="true">CM</div>
          </div>
          <div>
            <p className="eyebrow">Preparados para recibirle</p>
            <h2>Una visita sencilla desde que sale de casa.</h2>
            <ul className="check-list check-list--large">
              <li><Check size={19} aria-hidden="true" /><span><strong>Orientación precisa</strong>Edificio, piso y consultorio visibles en cada perfil.</span></li>
              <li><Check size={19} aria-hidden="true" /><span><strong>Canales directos</strong>Teléfono y correo del área disponibles antes de su visita.</span></li>
              <li><Check size={19} aria-hidden="true" /><span><strong>Acceso informado</strong>Horarios, avisos y preparación de consulta en un mismo lugar.</span></li>
            </ul>
            <Link className="button button--secondary" to="/contacto#ubicacion">Planear mi visita</Link>
          </div>
        </div>
      </section>

      <section className="clinic-numbers">
        <div className="container clinic-numbers__grid">
          <div><strong>{specialties.length}</strong><span>especialidades</span></div>
          <div><strong>{doctors.length}</strong><span>profesionales publicados</span></div>
          <div><strong>1</strong><span>equipo coordinado</span></div>
        </div>
      </section>
    </>
  )
}
