import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { NewsArticle } from '../types'

const dateFormatter = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function NewsCard({ article, featured = false }: { article: NewsArticle; featured?: boolean }) {
  return (
    <article className={`news-card${featured ? ' news-card--featured' : ''}`}>
      <Link className="news-card__image" to={`/noticias/${article.slug}`} tabIndex={-1} aria-hidden="true">
        <img src={article.image} alt="" loading="lazy" />
      </Link>
      <div className="news-card__body">
        <div className="news-card__meta">
          <span>{article.category}</span>
          <time dateTime={article.date}>{dateFormatter.format(new Date(article.date))}</time>
        </div>
        <h3>
          <Link to={`/noticias/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
        <Link className="text-link" to={`/noticias/${article.slug}`}>
          Leer artículo <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
