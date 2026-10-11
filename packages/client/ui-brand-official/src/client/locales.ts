/** iVeman brand copy owned by the browser brand plugin. */

/** Dictionary namespace for the sidebar brand name. */
export const NS = 'iveman-brand'

/** Simplified Chinese dictionary. */
export const zh = {
  name: 'iVeman',
  badge: 'HARNESS',
  attribution: '基于',
  upstream: 'DeepSeek Harness',
} as const

/** Brand dictionary key union. */
export type BrandKey = keyof typeof zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Sidebar brand name and upstream attribution. */
    'iveman-brand': BrandKey
  }
}

/** English dictionary with the same keys as the Chinese source. */
export const en: Record<BrandKey, string> = {
  name: 'iVeman',
  badge: 'HARNESS',
  attribution: 'Built on',
  upstream: 'DeepSeek Harness',
}
