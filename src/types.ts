export type SpecialtyIconName =
  | 'activity'
  | 'baby'
  | 'heart'
  | 'microscope'
  | 'sparkles'
  | 'stethoscope'

export interface Specialty {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  services: string[]
  icon: SpecialtyIconName
  featured: boolean
}

export interface Doctor {
  id: string
  slug: string
  name: string
  role: string
  specialtyIds: string[]
  focus: string[]
  image: string
  imageIsPlaceholder?: boolean
  imagePosition?: string
  bio: string
  office: string
  floor: string
  building: string
  phone: string
  email: string
  schedule: string
  languages: string[]
  education: string[]
  acceptingAppointments: boolean
  availabilityLabel?: string
  nextAvailable: string
  featured: boolean
}

export type NewsCategory = 'Bienestar' | 'Clínica' | 'Prevención' | 'Servicios'

export interface NewsArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string[]
  category: NewsCategory
  date: string
  readingTime: string
  image: string
  published: boolean
  featured: boolean
}

export type NoticeType = 'info' | 'important'

export interface ClinicNotice {
  id: string
  title: string
  message: string
  type: NoticeType
  ctaLabel?: string
  ctaUrl?: string
  updatedAt: string
  active: boolean
}

export interface SiteSettings {
  clinicName: string
  descriptor: string
  phone: string
  whatsapp: string
  email: string
  address: string
  hoursWeek: string
  hoursSaturday: string
  emergencyNote: string
}
