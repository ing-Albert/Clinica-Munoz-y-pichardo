import { Accessibility, LockKeyhole } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { useClinicData } from '../context/ClinicDataContext'

function LegalPage({
  eyebrow,
  title,
  intro,
  icon,
  children,
}: {
  eyebrow: string
  title: string
  intro: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <>
      <section className="page-hero legal-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: title }]} />
          <span className="legal-hero__icon">{icon}</span>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </section>
      <section className="section legal-content">
        <div className="container legal-content__inner">{children}</div>
      </section>
    </>
  )
}

export function PrivacyPage() {
  const { settings } = useClinicData()
  return (
    <LegalPage
      eyebrow="Protección de datos"
      title="Privacidad"
      intro="Explicamos de forma sencilla qué información se solicita y cómo debe protegerse."
      icon={<LockKeyhole size={25} aria-hidden="true" />}
    >
      <aside>
        <strong>Documento de demostración</strong>
        <p>Antes del lanzamiento, este texto deberá revisarse según el país, los servicios conectados y las obligaciones legales de la clínica.</p>
      </aside>
      <h2>Datos de contacto</h2>
      <p>El formulario solicita únicamente los datos necesarios para responder y coordinar una posible cita: nombre, teléfono, correo, preferencia de contacto y servicio de interés.</p>
      <h2>Información médica</h2>
      <p>No envíe diagnósticos, resultados, números de historia clínica ni otros datos médicos sensibles mediante formularios generales, correo o redes sociales.</p>
      <h2>Uso y conservación</h2>
      <p>En la versión conectada, los datos deberán enviarse mediante canales cifrados, conservarse solo durante el tiempo necesario y estar disponibles únicamente para personal autorizado.</p>
      <h2>Contacto</h2>
      <p>Para consultas relacionadas con privacidad, escriba a <a href={`mailto:${settings.email}`}>{settings.email}</a>.</p>
    </LegalPage>
  )
}

export function AccessibilityPage() {
  const { settings } = useClinicData()
  return (
    <LegalPage
      eyebrow="Compromiso de acceso"
      title="Accesibilidad"
      intro="Trabajamos para que la información y los servicios digitales puedan ser utilizados por todas las personas."
      icon={<Accessibility size={26} aria-hidden="true" />}
    >
      <h2>Nuestro objetivo</h2>
      <p>El sitio se ha diseñado con el objetivo de cumplir WCAG 2.2 nivel AA: navegación por teclado, foco visible, contraste suficiente, estructura semántica y adaptación a pantallas pequeñas y ampliación de texto.</p>
      <h2>Ayudas incorporadas</h2>
      <ul>
        <li>Enlace para saltar directamente al contenido principal.</li>
        <li>Etiquetas persistentes y mensajes comprensibles en formularios.</li>
        <li>Menús operables mediante teclado y cierre con la tecla Escape.</li>
        <li>Reducción de movimiento según la preferencia del dispositivo.</li>
      </ul>
      <h2>Reportar una dificultad</h2>
      <p>Si encuentra una barrera, indíquenos la página, el dispositivo y la ayuda técnica utilizada. Puede escribir a <a href={`mailto:${settings.email}`}>{settings.email}</a> o visitar la sección de <Link to="/contacto">contacto</Link>.</p>
    </LegalPage>
  )
}
