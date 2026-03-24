export const G    = '#C67A3C'   // Warm amber/orange accent
export const GL   = '#D4943E'   // Lighter orange — hover states
export const MNAV = '#3D2510'   // Deep burnt — marquee band background
export const MTEXT = '#F8DCC8'  // Light warm — text on dark band
export const CR   = '#F0EAE0'
export const BG   = '#080808'
export const BG2  = '#0d0d0d'
export const B    = 'rgba(240,234,224,0.08)'
export const GB = (o: number) => `rgba(198,122,60,${o})`

// Gradient helpers
export const NAVY_DEEP = '#2A1508'
export const NAVY_MID  = '#0a0806'
export const GRAD_HERO = 'linear-gradient(180deg, rgba(42,21,8,0.4) 0%, rgba(8,8,8,0.85) 100%)'
export const GRAD_SECTION = (navyOpacity = 0.35) =>
  `linear-gradient(180deg, rgba(10,8,6,${navyOpacity}) 0%, #080808 100%)`
export const GRAD_NAV = 'linear-gradient(180deg, rgba(10,8,6,0.98), rgba(8,8,8,0.97))'
