export interface PluginCollapsibleOptions {
  /** Minimum lines to trigger auto-collapse. Default: `15` */
  lineThreshold?: number
  /** Lines visible in collapsed state. Default: `8` */
  previewLines?: number
  /** Whether to start collapsed. Default: `true` */
  defaultCollapsed?: boolean
  /** Button text when collapsed. Default: `"Show more"` */
  expandButtonText?: string
  /** Button text when expanded. Default: `"Show less"` */
  collapseButtonText?: string
}
