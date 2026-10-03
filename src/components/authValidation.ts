// ── Registration / login validators (v6.6 task 30) ─────────────────────────
// Each returns an error message in Turkish, or '' when the value is fine.

export const PASSWORD_ALLOWED = /^[A-Za-z0-9!@#$%^&*()_+\-=.,?]+$/

export interface PasswordRule { key: string; label: string; ok: boolean }

export function passwordRules(pw: string): PasswordRule[] {
  return [
    { key: 'len', label: '8-32 karakter uzunluğunda olmalı', ok: pw.length >= 8 && pw.length <= 32 },
    { key: 'upper', label: 'En az bir büyük harf içermeli', ok: /[A-ZÇĞİÖŞÜ]/.test(pw) },
    { key: 'lower', label: 'En az bir küçük harf içermeli', ok: /[a-zçğıöşü]/.test(pw) },
    { key: 'digit', label: 'En az bir rakam içermeli', ok: /\d/.test(pw) },
    { key: 'chars', label: 'Boşluk veya desteklenmeyen karakter içermemeli', ok: pw.length > 0 && !/\s/.test(pw) && PASSWORD_ALLOWED.test(pw) },
  ]
}

export function validatePassword(pw: string): string {
  if (!pw) return 'Şifre gerekli.'
  if (/\s/.test(pw)) return 'Şifre boşluk içeremez.'
  if (!PASSWORD_ALLOWED.test(pw)) return 'Şifre geçersiz karakter içeriyor. Harf, rakam ve ! @ # $ % ^ & * ( ) _ + - = . , ? kullanabilirsiniz.'
  if (pw.length < 8) return 'Şifre en az 8 karakter olmalı.'
  if (pw.length > 32) return 'Şifre en fazla 32 karakter olabilir.'
  if (!/[A-ZÇĞİÖŞÜ]/.test(pw)) return 'Şifre en az bir büyük harf içermeli.'
  if (!/[a-zçğıöşü]/.test(pw)) return 'Şifre en az bir küçük harf içermeli.'
  if (!/\d/.test(pw)) return 'Şifre en az bir rakam içermeli.'
  return ''
}

export function validatePasswordConfirm(pw: string, confirm: string): string {
  if (!confirm) return 'Şifre tekrarı gerekli.'
  if (pw !== confirm) return 'Şifreler eşleşmiyor.'
  return ''
}

export function validateUsername(u: string): string {
  const v = u.trim()
  if (!v) return 'Kullanıcı adı gerekli.'
  if (v.length < 4) return 'Kullanıcı adı en az 4 karakter olmalı.'
  if (v.length > 20) return 'Kullanıcı adı en fazla 20 karakter olabilir.'
  if (!/^[A-Za-z0-9_.]+$/.test(v)) return 'Kullanıcı adı yalnızca harf, rakam, "_" ve "." içerebilir (Türkçe karakter ve boşluk olmaz).'
  return ''
}

export function validateEmail(e: string): string {
  const v = e.trim()
  if (!v) return 'E-posta adresi gerekli.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Geçerli bir e-posta adresi girin.'
  return ''
}

export function validateGmail(e: string): string {
  const base = validateEmail(e)
  if (base) return base
  if (!/@gmail\.com$/i.test(e.trim())) return 'Lütfen bir Gmail adresi (…@gmail.com) girin.'
  return ''
}

// `dial` is the country code with the plus, e.g. "+90".
export function validatePhone(dial: string, raw: string): string {
  const v = raw.replace(/[\s()-]/g, '')
  if (!v) return 'Telefon numarası gerekli.'
  if (!/^\d+$/.test(v)) return 'Telefon numarası yalnızca rakam içermeli.'
  const n = v.replace(/^0+/, '')
  if (dial === '+90') {
    if (n.length !== 10) return 'Telefon numarası 10 haneli olmalı (örn. 5XX XXX XX XX).'
    if (!n.startsWith('5')) return 'Türkiye cep telefonu numarası 5 ile başlamalı.'
    return ''
  }
  if (n.length < 6 || n.length > 12) return 'Geçerli bir telefon numarası girin.'
  return ''
}

export function normalizePhone(dial: string, raw: string): string {
  return dial + raw.replace(/\D/g, '').replace(/^0+/, '')
}

export function validateRequired(v: string, message: string): string {
  return v.trim() ? '' : message
}
