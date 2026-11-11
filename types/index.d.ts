/** Leiste ausgeblendet (per /egm-leiste oder × umschaltbar). */
export type Hidden = boolean

declare module 'claude-code' {
  interface PluginState {
    'egm-knoepfe': { isHidden: Hidden }
  }
}
