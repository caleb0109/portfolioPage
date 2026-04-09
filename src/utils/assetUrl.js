/** Public files (e.g. under public/) for GitHub Pages project sites (base path /repo/). */
export function assetUrl(path) {
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${normalized}`
}
