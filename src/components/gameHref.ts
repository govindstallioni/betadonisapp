// Builds the URL for a casino game's detail page (/game).
export function gameHref(name: string, img = '', provider = '') {
  return `/game?${new URLSearchParams({ name, img, provider }).toString()}`
}
