const ABSOLUTE_URL_RE = /^(?:[a-z]+:)?\/\//i

export function resolveAssetUrl(path) {
  if (!path) return path
  if (ABSOLUTE_URL_RE.test(path) || path.startsWith('data:')) return path

  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedPath = path.replace(/^\.?\//, '')

  return `${normalizedBase}${normalizedPath}`
}
