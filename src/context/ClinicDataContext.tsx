import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  initialSettings,
} from '../data/clinic'
import {
  officialDoctors as initialDoctors,
  officialNews as initialNews,
  officialNotices as initialNotices,
  officialSpecialties as initialSpecialties,
} from '../data/officialClinic'
import type {
  ClinicNotice,
  Doctor,
  NewsArticle,
  SiteSettings,
  Specialty,
} from '../types'

interface ClinicData {
  revision: number
  doctors: Doctor[]
  specialties: Specialty[]
  news: NewsArticle[]
  notices: ClinicNotice[]
  settings: SiteSettings
}

export type NewsDraft = Pick<
  NewsArticle,
  'title' | 'excerpt' | 'body' | 'category' | 'image' | 'published'
>

export type NoticeDraft = Pick<
  ClinicNotice,
  'title' | 'message' | 'type' | 'ctaLabel' | 'ctaUrl' | 'active'
>

export type SpecialtyDraft = Pick<
  Specialty,
  'name' | 'shortDescription' | 'description' | 'services' | 'icon' | 'featured'
>

interface ClinicDataContextValue extends ClinicData {
  updateDoctor: (id: string, updates: Partial<Doctor>) => void
  addSpecialty: (draft: SpecialtyDraft) => void
  updateSpecialty: (id: string, updates: Partial<Specialty>) => void
  addNews: (draft: NewsDraft) => void
  updateNews: (id: string, updates: Partial<NewsArticle>) => void
  deleteNews: (id: string) => void
  addNotice: (draft: NoticeDraft) => void
  updateNotice: (id: string, updates: Partial<ClinicNotice>) => void
  deleteNotice: (id: string) => void
  updateSettings: (updates: Partial<SiteSettings>) => void
  resetData: () => void
}

const STORAGE_KEY = 'centro-medico-munoz-pichardo-content-v3'

const initialData: ClinicData = {
  revision: 0,
  doctors: initialDoctors,
  specialties: initialSpecialties,
  news: initialNews,
  notices: initialNotices,
  settings: initialSettings,
}

const ClinicDataContext = createContext<ClinicDataContextValue | null>(null)

function loadData(): ClinicData {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return initialData
    return parseStoredData(stored)
  } catch {
    return initialData
  }
}

function parseStoredData(stored: string): ClinicData {
  const parsed = JSON.parse(stored) as Partial<ClinicData>
  const settings = { ...initialData.settings, ...parsed.settings }
  settings.clinicName = initialData.settings.clinicName
  settings.descriptor = initialData.settings.descriptor
  return {
    revision: parsed.revision ?? 0,
    doctors: parsed.doctors ?? initialData.doctors,
    specialties: parsed.specialties ?? initialData.specialties,
    news: parsed.news ?? initialData.news,
    notices: parsed.notices ?? initialData.notices,
    settings,
  }
}

function persistData(data: ClinicData) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent('clinic:persistence-status', { detail: null }))
    return true
  } catch {
    window.dispatchEvent(
      new CustomEvent('clinic:persistence-status', {
        detail: 'No queda espacio para guardar los últimos cambios. Use imágenes más pequeñas.',
      }),
    )
    return false
  }
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}`
}

function getReadingTime(body: string[]) {
  const wordCount = body.join(' ').trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(wordCount / 200))
  return `${minutes} min de lectura`
}

function getLocalDate() {
  const now = new Date()
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return localTime.toISOString().slice(0, 10)
}

export function ClinicDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ClinicData>(loadData)
  const dataRef = useRef(data)
  const persistenceFailedRef = useRef(false)

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        persistenceFailedRef.current = !persistData(dataRef.current)
      }
    } catch {
      persistenceFailedRef.current = true
      window.dispatchEvent(
        new CustomEvent('clinic:persistence-status', {
          detail: 'El navegador bloqueó el almacenamiento local. Los cambios durarán solo durante esta sesión.',
        }),
      )
    }
  }, [])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      try {
        const incoming = parseStoredData(event.newValue)
        if (incoming.revision <= dataRef.current.revision) return
        persistenceFailedRef.current = false
        dataRef.current = incoming
        setData(incoming)
      } catch {
        // Ignore malformed changes from another tab and keep the valid local state.
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const commitData = (updater: (current: ClinicData) => ClinicData) => {
    const applyCommit = () => {
      let current = dataRef.current
      if (!persistenceFailedRef.current) {
        try {
          const stored = window.localStorage.getItem(STORAGE_KEY)
          if (stored) {
            const latest = parseStoredData(stored)
            if (latest.revision > current.revision) current = latest
          }
        } catch {
          // Keep the valid in-memory state when stored data cannot be parsed.
        }
      }

      const updated = updater(current)
      if (updated === current) return
      const next = {
        ...updated,
        revision: Math.max(current.revision, dataRef.current.revision) + 1,
      }
      persistenceFailedRef.current = !persistData(next)
      dataRef.current = next
      setData(next)
    }

    if (navigator.locks) {
      void navigator.locks.request(`${STORAGE_KEY}:write`, applyCommit)
    } else {
      applyCommit()
    }
  }

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    commitData((current) => ({
      ...current,
      doctors: current.doctors.map((doctor) =>
        doctor.id === id ? { ...doctor, ...updates } : doctor,
      ),
    }))
  }

  const updateSpecialty = (id: string, updates: Partial<Specialty>) => {
    commitData((current) => ({
      ...current,
      specialties: current.specialties.map((specialty) =>
        specialty.id === id ? { ...specialty, ...updates } : specialty,
      ),
    }))
  }

  const addSpecialty = (draft: SpecialtyDraft) => {
    const id = createId()
    commitData((current) => {
      const baseSlug = slugify(draft.name)
      if (!baseSlug) return current
      const slug = current.specialties.some((specialty) => specialty.slug === baseSlug)
        ? `${baseSlug}-${id.slice(0, 6)}`
        : baseSlug
      return {
        ...current,
        specialties: [...current.specialties, { ...draft, id, slug }],
      }
    })
  }

  const addNews = (draft: NewsDraft) => {
    const id = createId()
    const article: NewsArticle = {
      ...draft,
      id,
      slug: `${slugify(draft.title)}-${id.slice(0, 6)}`,
      date: getLocalDate(),
      readingTime: getReadingTime(draft.body),
      featured: false,
    }

    commitData((current) => ({ ...current, news: [article, ...current.news] }))
  }

  const updateNews = (id: string, updates: Partial<NewsArticle>) => {
    commitData((current) => ({
      ...current,
      news: current.news.map((article) => {
        if (article.id !== id) return article
        const updatedArticle = { ...article, ...updates }
        return updates.body
          ? { ...updatedArticle, readingTime: getReadingTime(updatedArticle.body) }
          : updatedArticle
      }),
    }))
  }

  const deleteNews = (id: string) => {
    commitData((current) => ({
      ...current,
      news: current.news.filter((article) => article.id !== id),
    }))
  }

  const addNotice = (draft: NoticeDraft) => {
    const notice: ClinicNotice = {
      ...draft,
      id: createId(),
      updatedAt: getLocalDate(),
    }
    commitData((current) => ({ ...current, notices: [notice, ...current.notices] }))
  }

  const updateNotice = (id: string, updates: Partial<ClinicNotice>) => {
    commitData((current) => ({
      ...current,
      notices: current.notices.map((notice) =>
        notice.id === id
          ? {
              ...notice,
              ...updates,
              updatedAt: getLocalDate(),
            }
          : notice,
      ),
    }))
  }

  const deleteNotice = (id: string) => {
    commitData((current) => ({
      ...current,
      notices: current.notices.filter((notice) => notice.id !== id),
    }))
  }

  const updateSettings = (updates: Partial<SiteSettings>) => {
    commitData((current) => ({
      ...current,
      settings: { ...current.settings, ...updates },
    }))
  }

  const resetData = () => commitData(() => initialData)

  return (
    <ClinicDataContext.Provider
      value={{
        ...data,
        updateDoctor,
        addSpecialty,
        updateSpecialty,
        addNews,
        updateNews,
        deleteNews,
        addNotice,
        updateNotice,
        deleteNotice,
        updateSettings,
        resetData,
      }}
    >
      {children}
    </ClinicDataContext.Provider>
  )
}

// The provider and its hook intentionally share one module.
// eslint-disable-next-line react-refresh/only-export-components
export function useClinicData() {
  const context = useContext(ClinicDataContext)
  if (!context) {
    throw new Error('useClinicData debe usarse dentro de ClinicDataProvider')
  }
  return context
}
