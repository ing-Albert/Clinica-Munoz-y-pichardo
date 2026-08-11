export const DEMO_ADMIN_EMAIL = 'admin@clinicamunoz.com'
export const DEMO_ADMIN_PASSWORD = 'Clinica2026'

const SESSION_KEY = 'clinica-munoz-admin-demo'

export function authenticateAdmin(email: string, password: string) {
  const valid = email.trim().toLowerCase() === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD
  if (valid) window.sessionStorage.setItem(SESSION_KEY, 'active')
  return valid
}

export function isAdminAuthenticated() {
  return window.sessionStorage.getItem(SESSION_KEY) === 'active'
}

export function endAdminSession() {
  window.sessionStorage.removeItem(SESSION_KEY)
}
