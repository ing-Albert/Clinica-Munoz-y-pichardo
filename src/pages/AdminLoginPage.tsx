import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import {
  authenticateAdmin,
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  isAdminAuthenticated,
} from '../lib/auth'

export function AdminLoginPage() {
  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL)
  const [password, setPassword] = useState(DEMO_ADMIN_PASSWORD)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  if (isAdminAuthenticated()) return <Navigate to="/admin" replace />

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (authenticateAdmin(email, password)) {
      navigate('/admin', { replace: true })
      return
    }
    setError('El correo o la contraseña no coinciden con el acceso de demostración.')
  }

  return (
    <main className="admin-login">
      <header className="admin-login__header">
        <Brand />
        <Link className="admin-login__back" to="/">
          <ArrowLeft size={17} aria-hidden="true" /> <span>Volver al sitio</span>
        </Link>
      </header>

      <div className="admin-login__body">
        <section className="admin-login__card" aria-labelledby="admin-login-title">
          <div className="admin-login__card-heading">
            <span className="admin-login__icon"><LockKeyhole size={22} aria-hidden="true" /></span>
            <div>
              <p>Acceso restringido</p>
              <h2 id="admin-login-title">Ingresar al panel</h2>
            </div>
          </div>
          <p className="admin-login__card-copy">Utilice sus credenciales de administración para continuar.</p>

          <aside className="admin-login__demo" aria-label="Credenciales de demostración">
            <div><AlertCircle size={17} aria-hidden="true" /><strong>Acceso de demostración</strong></div>
            <dl>
              <div><dt>Correo</dt><dd><code>{DEMO_ADMIN_EMAIL}</code></dd></div>
              <div><dt>Contraseña</dt><dd><code>{DEMO_ADMIN_PASSWORD}</code></dd></div>
            </dl>
          </aside>

          <div className="admin-login__form-wrap">
            <form onSubmit={handleSubmit}>
              <label>
                Correo electrónico
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label>
                Contraseña
                <span className="password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                  </button>
                </span>
              </label>
              {error && <p className="form-error" role="alert"><AlertCircle size={17} aria-hidden="true" /> {error}</p>}
              <button className="button admin-login__submit button--full" type="submit">Ingresar al panel</button>
            </form>
          </div>

          <div className="admin-security-note">
            <AlertCircle size={17} aria-hidden="true" />
            <p>Prototipo local. La versión pública requerirá autenticación segura, permisos y registro de cambios.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
