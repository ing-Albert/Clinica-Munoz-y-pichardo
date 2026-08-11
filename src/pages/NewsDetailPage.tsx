import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Share2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { NewsCard } from '../components/NewsCard'
import { useClinicData } from '../context/ClinicDataContext'

const dateFormatter = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function NewsDetailPage() {
  const { slug } = useParams()
  const { news } = useClinicData()
  const article = news.find((item) => item.slug === slug && item.published)

  if (!article) {
    return (
      <section className="section">
        <div className="container empty-state">
          <h1>Publicación no encontrada</h1>
          <p>Este contenido no está disponible o dejó de estar publicado.</p>
          <Link className="button button--primary" to="/noticias">Ver noticias</Link>
        </div>
      </section>
    )
  }

  const related = news
    .filter((item) => item.id !== article.id && item.published)
    .slice(0, 2)

  return (
    <>
      <article className="article-page">
        <header className="article-header">
          <div className="container article-header__inner">
            <Breadcrumbs
              items={[
                { label: 'Inicio', to: '/' },
                { label: 'Noticias', to: '/noticias' },
                { label: article.title },
              ]}
            />
            <Link className="profile-back-link" to="/noticias">
              <ArrowLeft size={17} aria-hidden="true" /> Volver a noticias
            </Link>
            <p className="eyebrow">{article.category}</p>
            <h1>{article.title}</h1>
            <p className="article-header__excerpt">{article.excerpt}</p>
            <div className="article-meta">
              <span><CalendarDays size={17} aria-hidden="true" /> {dateFormatter.format(new Date(article.date))}</span>
              <span><Clock3 size={17} aria-hidden="true" /> {article.readingTime}</span>
            </div>
          </div>
        </header>
        <div className="container article-image">
          <img src={article.image} alt="" />
        </div>
        <div className="container article-layout">
          <div className="article-share" aria-label="Compartir publicación">
            <span><Share2 size={18} aria-hidden="true" /> Compartir</span>
            <a href={`mailto:?subject=${encodeURIComponent(article.title)}`}>Correo</a>
          </div>
          <div className="article-body">
            {article.body.map((paragraph, index) => <p key={`${article.id}-${index}`}>{paragraph}</p>)}
            <aside className="article-disclaimer">
              <strong>Información general</strong>
              <p>Este contenido es educativo y no sustituye una evaluación médica individual.</p>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section related-news">
          <div className="container">
            <div className="section-heading">
              <div className="section-heading__copy">
                <p className="eyebrow">Continúe leyendo</p>
                <h2>También puede interesarle</h2>
              </div>
              <div className="section-heading__action">
                <Link className="text-link" to="/noticias">Ver todo <ArrowRight size={17} aria-hidden="true" /></Link>
              </div>
            </div>
            <div className="news-grid news-grid--two">
              {related.map((item) => <NewsCard key={item.id} article={item} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
