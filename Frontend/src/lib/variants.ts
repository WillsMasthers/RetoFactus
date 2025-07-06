import { cva } from 'class-variance-authority'

// Constantes de estilos comunes
const FOCUS_STYLES =
  'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current'

// Función para generar estilos de variantes outline (itálica)
const getOutlineVariant = (color: string) =>
  `border border-current bg-transparent italic text-${color}-600 dark:text-${color}-400 hover:text-${color}-800 dark:hover:text-${color}-300 dark:hover:bg-${color}-900/30 transition-colors`

// Función para generar estilos de variantes link
const getLinkVariant = (color: string) =>
  `bg-transparent text-${color}-600 dark:text-${color}-400 underline-offset-4 hover:underline hover:bg-transparent`

// Función para generar estilos de variantes ghost
const getGhostVariant = (color: string, lightHoverShade: string = '50') => {
  // Manejo especial para el color slate que usa hover:bg-slate-100
  const lightHover =
    color === 'slate'
      ? 'hover:bg-slate-100'
      : `hover:bg-${color}-${lightHoverShade}`

  return `bg-transparent text-${color}-600 dark:text-${color}-400 ${lightHover} dark:hover:bg-${color}-900/40 transition-colors`
}

// Función para generar estilos de variantes soft (negrita)
const getSoftVariant = (
  color: string,
  lightBgShade: string = '100',
  darkBgOpacity: string = '30'
) => {
  const lightBg = `bg-${color}-${lightBgShade} font-bold text-${color}-800`
  const darkBg = `dark:bg-${color}-900/${darkBgOpacity} dark:text-${color}-200`
  return `${lightBg} ${darkBg} hover:bg-opacity-80 transition-colors`
}

// Tipos para las variantes
type ColorType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
type VariantType =
  | ColorType
  | `light-${ColorType}`
  | `dark-${ColorType}`
  | `outline-${ColorType}`
  | `ghost-${ColorType}`
  | `link-${ColorType}`
  | `soft-${ColorType}`

// Función para generar variantes
function generateButtonVariants(): Record<VariantType, string> {
  const variants = {} as Record<VariantType, string>

  // Primary variants
  variants[
    'light-primary'
  ] = `bg-blue-400 text-slate-800 hover:bg-blue-500 ${FOCUS_STYLES}`
  variants[
    'primary'
  ] = `bg-blue-600 text-slate-300 hover:bg-blue-700 ${FOCUS_STYLES}`
  variants[
    'dark-primary'
  ] = `bg-blue-800 text-slate-200 hover:bg-blue-900 ${FOCUS_STYLES}`

  // Secondary variants
  variants[
    'light-secondary'
  ] = `bg-slate-200 text-slate-800 hover:bg-slate-300 ${FOCUS_STYLES}`
  variants[
    'secondary'
  ] = `bg-slate-600 text-slate-300 hover:bg-slate-700 ${FOCUS_STYLES}`
  variants[
    'dark-secondary'
  ] = `bg-slate-900 text-slate-200 hover:bg-slate-950 ${FOCUS_STYLES}`

  // Tertiary variants
  variants[
    'light-tertiary'
  ] = `bg-purple-400 text-slate-800 hover:bg-purple-500 ${FOCUS_STYLES}`
  variants[
    'tertiary'
  ] = `bg-purple-600 text-slate-300 hover:bg-purple-700 ${FOCUS_STYLES}`
  variants[
    'dark-tertiary'
  ] = `bg-purple-800 text-slate-200 hover:bg-purple-900 ${FOCUS_STYLES}`

  // Danger variants
  variants[
    'light-danger'
  ] = `bg-red-400 text-slate-800 hover:bg-red-500 ${FOCUS_STYLES}`
  variants[
    'danger'
  ] = `bg-red-600 text-slate-300 hover:bg-red-700 ${FOCUS_STYLES}`
  variants[
    'dark-danger'
  ] = `bg-red-800 text-slate-200 hover:bg-red-900 ${FOCUS_STYLES}`

  // Success variants
  variants[
    'light-success'
  ] = `bg-green-400 text-slate-800 hover:bg-green-500 ${FOCUS_STYLES}`
  variants[
    'success'
  ] = `bg-green-600 text-slate-300 hover:bg-green-700 ${FOCUS_STYLES}`
  variants[
    'dark-success'
  ] = `bg-green-800 text-slate-200 hover:bg-green-900 ${FOCUS_STYLES}`

  // Warning variants
  variants[
    'light-warning'
  ] = `bg-yellow-400 text-black hover:bg-yellow-500 ${FOCUS_STYLES}`
  variants[
    'warning'
  ] = `bg-yellow-500 text-black hover:bg-yellow-600 ${FOCUS_STYLES}`
  variants[
    'dark-warning'
  ] = `bg-yellow-700 text-slate-200 hover:bg-yellow-800 ${FOCUS_STYLES}`

  // Info variants
  variants[
    'light-info'
  ] = `bg-sky-400 text-slate-800 hover:bg-sky-500 ${FOCUS_STYLES}`
  variants[
    'info'
  ] = `bg-sky-500 text-slate-300 hover:bg-sky-600 ${FOCUS_STYLES}`
  variants[
    'dark-info'
  ] = `bg-sky-700 text-slate-200 hover:bg-sky-800 ${FOCUS_STYLES}`

  // Outline variants - darker text on hover with background
  variants['outline-primary'] = getOutlineVariant('blue')
  variants['outline-secondary'] = getOutlineVariant('slate')
  variants['outline-tertiary'] = getOutlineVariant('purple')
  variants['outline-danger'] = getOutlineVariant('red')
  variants['outline-success'] = getOutlineVariant('green')
  variants['outline-warning'] = getOutlineVariant('yellow')
  variants['outline-info'] = getOutlineVariant('sky')

  // Ghost variants
  variants['ghost-primary'] = getGhostVariant('blue')
  variants['ghost-secondary'] = getGhostVariant('slate', '100')
  variants['ghost-tertiary'] = getGhostVariant('purple')
  variants['ghost-danger'] = getGhostVariant('red')
  variants['ghost-success'] = getGhostVariant('green')
  variants['ghost-warning'] = getGhostVariant('yellow')
  variants['ghost-info'] = getGhostVariant('sky')

  // Link variants
  variants['link-primary'] = getLinkVariant('blue')
  variants['link-secondary'] = getLinkVariant('slate')
  variants['link-tertiary'] = getLinkVariant('purple')
  variants['link-danger'] = getLinkVariant('red')
  variants['link-success'] = getLinkVariant('green')
  variants['link-warning'] = getLinkVariant('yellow')
  variants['link-info'] = getLinkVariant('sky')

  // Soft variants
  variants['soft-primary'] = getSoftVariant('blue')
  variants['soft-secondary'] = getSoftVariant('slate')
  variants['soft-tertiary'] = getSoftVariant('purple')
  variants['soft-danger'] = getSoftVariant('red')
  variants['soft-success'] = getSoftVariant('green')
  variants['soft-warning'] = getSoftVariant('yellow')
  variants['soft-info'] = getSoftVariant('sky')

  return variants
}

// Generar las variantes
const buttonVariantsMap = generateButtonVariants()

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-md text-sm font-medium',
    'transition-colors',
    'focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-50'
  ].join(' '),
  {
    variants: {
      variant: buttonVariantsMap,
      size: {
        sm: 'h-9 rounded-md px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-11 rounded-md px-8 text-base',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)
