import { AlertCircle, ArrowRight, Bell, Newspaper } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { NewsCard } from '../components/NewsCard'
import { useClinicData } from '../context/ClinicDataContext'
import type { NewsCategory } from '../types'

const categories: Array<'Todas' | NewsCategory> = ['Todas', 'Prevención', 'Servicios', 'Bienestar', 'Clínica']

export function NewsPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>('Todas')
  const { news, notices } = useClinicData()
  const activeNotices = notices.filter((notice) => notice.active)
  const publishedNews = news.filter(
    (article) => article.published && (category === 'Todas' || article.category === category),
  )

  return (
    <>
      <section className="page-hero page-hero--editorial">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Noticias y avisos' }]} />
          <div className="page-hero__grid">
            <div>
              <p className="eyebrow">Información útil</p>
              <h1>Noticias de la clínica y orientación para su bienestar.</h1>
            </div>
            <p>
              Consulte novedades de servicio, avisos operativos y contenidos preparados para ayudarle a tomar decisiones informadas.
            </p>
          </div>
        </div>
      </section>

      {activeNotices.length > 0 && (
        <section className="section notices-section">
          <div className="container">
            <div className="notices-heading">
              <span><Bell size={21} aria-hidden="true" /></span>
              <div>
                <p className="eyebrow">Avisos vigentes</p>
                <h2>Información antes de su visita</h2>
              </div>
            </div>
            <div className="notices-list">
              {activeNotices.map((notice) => (
                <article className={`notice-card notice-card--${notice.type}`} key={notice.id}>
                  <AlertCircle size={21} aria-hidden="true" />
                  <div>
                    <h3>{notice.title}</h3>
                    <p>{notice.message}</p>
                    <small>Actualizado el {notice.updatedAt}</small>
                  </div>
                  {notice.ctaLabel && notice.ctaUrl && (
                    <Link to={notice.ctaUrl}>{notice.ctaLabel} <ArrowRight size={16} aria-hidden="true" /></Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section news-directory">
        <div className="container">
          <div className="news-directory__heading">
            <div>
              <p className="eyebrow">Publicaciones</p>
              <h2>Actualidad y consejos de salud</h2>
            </div>
            <div className="category-filter" aria-label="Filtrar publicaciones por categoría">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? 'active' : ''}
                  type="button"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <p className="results-summary" aria-live="polite">
            <strong>{publishedNews.length}</strong>{' '}
            {publishedNews.length === 1 ? 'publicación' : 'publicaciones'}
          </p>
          {publishedNews.length > 0 ? (
            <div className="news-grid news-grid--directory">
              {publishedNews.map((article) => <NewsCard key={article.id} article={article} />)}
            </div>
          ) : (
            <div className="empty-state">
              <Newspaper size={32} aria-hidden="true" />
              <h3>No hay publicaciones en esta categoría</h3>
              <button className="button button--secondary" type="button" onClick={() => setCategory('Todas')}>
                Ver todas
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
