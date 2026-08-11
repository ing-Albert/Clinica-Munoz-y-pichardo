import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <div className="section-heading__copy">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="section-heading__action">{action}</div>}
    </div>
  )
}
