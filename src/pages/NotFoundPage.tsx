import { ArrowLeft, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <span className="not-found__code">404</span>
        <Search size={32} aria-hidden="true" />
        <p className="eyebrow">Página no encontrada</p>
        <h1>No pudimos encontrar lo que busca.</h1>
        <p>La dirección puede haber cambiado o el contenido ya no está disponible.</p>
        <Link className="button button--primary" to="/">
          <ArrowLeft size={17} aria-hidden="true" /> Volver al inicio
        </Link>
      </div>
    </section>
  )
}
