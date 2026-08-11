import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Specialty } from '../types'
import { SpecialtyIcon } from './SpecialtyIcon'

export function SpecialtyCard({ specialty, index = 0 }: { specialty: Specialty; index?: number }) {
  return (
    <Link className="specialty-card" to={`/especialidades/${specialty.slug}`}>
      <span className="specialty-card__number" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="specialty-card__icon">
        <SpecialtyIcon name={specialty.icon} size={26} />
      </span>
      <span className="specialty-card__content">
        <strong>{specialty.name}</strong>
        <span>{specialty.shortDescription}</span>
      </span>
      <ArrowUpRight className="specialty-card__arrow" size={20} aria-hidden="true" />
    </Link>
  )
}
