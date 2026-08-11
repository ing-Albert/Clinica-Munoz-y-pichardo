import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type {
  ClinicNotice,
  Doctor,
  NewsArticle,
  SiteSettings,
  Specialty,
} from '../types'
import { initialSettings } from '../data/clinic'

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

interface ClinicData {
  doctors: Doctor[]
  specialties: Specialty[]
  news: NewsArticle[]
  notices: ClinicNotice[]
  settings: SiteSettings
  loading: boolean
}

interface ClinicDataContextValue extends ClinicData {
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<void>
  addSpecialty: (draft: SpecialtyDraft) => Promise<void>
  updateSpecialty: (id: string, updates: Partial<Specialty>) => Promise<void>
  addNews: (draft: NewsDraft) => Promise<void>
  updateNews: (id: string, updates: Partial<NewsArticle>) => Promise<void>
  deleteNews: (id: string) => Promise<void>
  addNotice: (draft: NoticeDraft) => Promise<void>
  updateNotice: (id: string, updates: Partial<ClinicNotice>) => Promise<void>
  deleteNotice: (id: string) => Promise<void>
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>
  refreshData: () => Promise<void>
}

const ClinicDataContext = createContext<ClinicDataContextValue | null>(null)

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
  const [data, setData] = useState<ClinicData>({
    doctors: [],
    specialties: [],
    news: [],
    notices: [],
    settings: initialSettings,
    loading: true,
  })

  const refreshData = async () => {
    try {
      const [doctorsRes, specialtiesRes, newsRes, noticesRes, settingsRes] = await Promise.all([
        supabase.from('doctors').select('*'),
        supabase.from('specialties').select('*'),
        supabase.from('news').select('*').order('date', { ascending: false }),
        supabase.from('notices').select('*').order('updatedAt', { ascending: false }),
        supabase.from('settings').select('*').eq('id', 'global').single(),
      ])

      setData({
        doctors: doctorsRes.data || [],
        specialties: specialtiesRes.data || [],
        news: newsRes.data || [],
        notices: noticesRes.data || [],
        settings: settingsRes.data || initialSettings,
        loading: false,
      })
    } catch (err) {
      console.error('Error fetching clinic data:', err)
      setData(prev => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
    await supabase.from('doctors').update(updates).eq('id', id)
    await refreshData()
  }

  const updateSpecialty = async (id: string, updates: Partial<Specialty>) => {
    await supabase.from('specialties').update(updates).eq('id', id)
    await refreshData()
  }

  const addSpecialty = async (draft: SpecialtyDraft) => {
    const id = createId()
    const baseSlug = slugify(draft.name)
    if (!baseSlug) return
    const slug = data.specialties.some((s) => s.slug === baseSlug)
      ? `${baseSlug}-${id.slice(0, 6)}`
      : baseSlug
      
    await supabase.from('specialties').insert({ ...draft, id, slug })
    await refreshData()
  }

  const addNews = async (draft: NewsDraft) => {
    const id = createId()
    const article: NewsArticle = {
      ...draft,
      id,
      slug: `${slugify(draft.title)}-${id.slice(0, 6)}`,
      date: getLocalDate(),
      readingTime: getReadingTime(draft.body),
      featured: false,
    }
    await supabase.from('news').insert(article)
    await refreshData()
  }

  const updateNews = async (id: string, updates: Partial<NewsArticle>) => {
    let finalUpdates = { ...updates }
    if (updates.body) {
      finalUpdates.readingTime = getReadingTime(updates.body)
    }
    await supabase.from('news').update(finalUpdates).eq('id', id)
    await refreshData()
  }

  const deleteNews = async (id: string) => {
    await supabase.from('news').delete().eq('id', id)
    await refreshData()
  }

  const addNotice = async (draft: NoticeDraft) => {
    const notice: ClinicNotice = {
      ...draft,
      id: createId(),
      updatedAt: getLocalDate(),
    }
    await supabase.from('notices').insert(notice)
    await refreshData()
  }

  const updateNotice = async (id: string, updates: Partial<ClinicNotice>) => {
    await supabase.from('notices').update({
      ...updates,
      updatedAt: getLocalDate()
    }).eq('id', id)
    await refreshData()
  }

  const deleteNotice = async (id: string) => {
    await supabase.from('notices').delete().eq('id', id)
    await refreshData()
  }

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    await supabase.from('settings').update(updates).eq('id', 'global')
    await refreshData()
  }

  const value: ClinicDataContextValue = {
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
    refreshData
  }

  return (
    <ClinicDataContext.Provider value={value}>
      {children}
    </ClinicDataContext.Provider>
  )
}

export function useClinicData() {
  const context = useContext(ClinicDataContext)
  if (!context) {
    throw new Error('useClinicData must be used within a ClinicDataProvider')
  }
  return context
}
