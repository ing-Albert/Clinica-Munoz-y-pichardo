export function phoneHref(phone: string) {
  const extension = phone.match(/(?:ext\.?|x)\s*(\d+)$/i)
  const mainNumber = extension ? phone.slice(0, extension.index).trim() : phone
  const normalizedNumber = mainNumber.replace(/[^\d+]/g, '')
  return extension ? `tel:${normalizedNumber};ext=${extension[1]}` : `tel:${normalizedNumber}`
}

export function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, '')
  const internationalNumber = digits.length === 10 && /^(809|829|849)/.test(digits)
    ? `1${digits}`
    : digits
  return `https://wa.me/${internationalNumber}`
}
