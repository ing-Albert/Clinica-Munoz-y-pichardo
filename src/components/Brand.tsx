import { Link } from 'react-router-dom'
import { useClinicData } from '../context/ClinicDataContext'
import logoUrl from '../logo sin fondo (2).png'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  const { settings } = useClinicData()

  return (
    <Link
      className={`brand${inverse ? ' brand--inverse' : ''}`}
      to="/"
      aria-label={`Ir al inicio de ${settings.clinicName}`}
    >
      <span className="brand__logo">
        <img src={logoUrl} alt="" />
      </span>
    </Link>
  )
}
