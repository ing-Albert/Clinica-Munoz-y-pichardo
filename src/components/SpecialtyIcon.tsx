import {
  Activity,
  Baby,
  HeartPulse,
  Microscope,
  Sparkles,
  Stethoscope,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SpecialtyIconName } from '../types'

const icons: Record<SpecialtyIconName, LucideIcon> = {
  activity: Activity,
  baby: Baby,
  heart: HeartPulse,
  microscope: Microscope,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
}

export function SpecialtyIcon({ name, size = 24 }: { name: SpecialtyIconName; size?: number }) {
  const Icon = icons[name]
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />
}
