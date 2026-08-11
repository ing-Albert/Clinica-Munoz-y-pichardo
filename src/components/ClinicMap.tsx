import { useClinicData } from '../context/ClinicDataContext'

const clinicCoordinates = '19.5804131,-70.9888034'
const clinicMapQuery = 'Centro Médico Muñoz & Pichardo S.R.L., Avenida María Trinidad Sánchez 44, Esperanza, Valverde, República Dominicana'
export const CLINIC_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinicMapQuery)}`
export const CLINIC_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinicMapQuery)}`

export function ClinicMap({ className = '' }: { className?: string }) {
  const { settings } = useClinicData()
  const src = `https://www.google.com/maps?q=${encodeURIComponent(clinicMapQuery)}&ll=${clinicCoordinates}&z=17&output=embed`

  return (
    <div className={`clinic-map-embed${className ? ` ${className}` : ''}`}>
      <iframe
        title={`Mapa de ${settings.clinicName}`}
        src={src}
        loading="lazy"
        allowFullScreen
        tabIndex={-1}
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        className="clinic-map-embed__link"
        href={CLINIC_MAP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={`Abrir la ubicación de ${settings.clinicName} en Google Maps`}
      >
        <span>Ver ubicación en Google Maps</span>
      </a>
    </div>
  )
}
