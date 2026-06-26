type EmailKey = 'school' | 'personal'

/** Obfuscated at rest — decoded only when building mailto / wa links */
const CONTACT_PAYLOAD = {
  school: 'bXVoYW1tYWQubWFsaWszNDEyM0BzbWsuYmVsYWphci5pZA==',
  personal: 'bWFsaWthY2Nvbmx5b25lQGdtYWlsLmNvbQ==',
  whatsapp: 'NjI4ODkxOTgzNzIz',
} as const

function decodeBase64(value: string): string {
  if (typeof atob !== 'function') return ''
  try {
    return atob(value)
  } catch {
    return ''
  }
}

export function getContactEmail(key: EmailKey): string {
  return decodeBase64(CONTACT_PAYLOAD[key])
}

export function buildSchoolMailto(): string {
  const email = getContactEmail('school')
  return email ? `mailto:${email}` : '#contact'
}

export function buildPersonalMailto(): string {
  const email = getContactEmail('personal')
  return email ? `mailto:${email}` : '#contact'
}

export function buildWhatsAppLink(): string {
  const number = decodeBase64(CONTACT_PAYLOAD.whatsapp)
  return number ? `https://wa.me/${number}` : '#contact'
}
