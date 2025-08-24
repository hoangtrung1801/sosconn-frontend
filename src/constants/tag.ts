export const TAG_VARIANTS = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  destructive: 'destructive',
  outline: 'outline',
} as const

export type TagVariant = keyof typeof TAG_VARIANTS

export const TOUR_TAG: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-purple-100 text-purple-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
}