import type { PluginCollapsibleOptions } from './types'

/**
 * Default configuration values
 */
export const DEFAULT_OPTIONS: Required<PluginCollapsibleOptions> = {
  lineThreshold: 15,
  previewLines: 8,
  defaultCollapsed: true,
  expandButtonText: 'Show more',
  collapseButtonText: 'Show less',
  expandedAnnouncement: 'Code block expanded',
  collapsedAnnouncement: 'Code block collapsed',
}

/**
 * Merges user options with defaults, with validation.
 * Invalid values silently fall back to defaults.
 */
export function resolveOptions(
  options: PluginCollapsibleOptions = {}
): Required<PluginCollapsibleOptions> {
  return {
    lineThreshold:
      typeof options.lineThreshold === 'number' && options.lineThreshold >= 1
        ? options.lineThreshold
        : DEFAULT_OPTIONS.lineThreshold,
    previewLines:
      typeof options.previewLines === 'number' && options.previewLines >= 1
        ? options.previewLines
        : DEFAULT_OPTIONS.previewLines,
    defaultCollapsed: options.defaultCollapsed ?? DEFAULT_OPTIONS.defaultCollapsed,
    expandButtonText:
      typeof options.expandButtonText === 'string' && options.expandButtonText.trim()
        ? options.expandButtonText
        : DEFAULT_OPTIONS.expandButtonText,
    collapseButtonText:
      typeof options.collapseButtonText === 'string' && options.collapseButtonText.trim()
        ? options.collapseButtonText
        : DEFAULT_OPTIONS.collapseButtonText,
    expandedAnnouncement:
      typeof options.expandedAnnouncement === 'string' && options.expandedAnnouncement.trim()
        ? options.expandedAnnouncement
        : DEFAULT_OPTIONS.expandedAnnouncement,
    collapsedAnnouncement:
      typeof options.collapsedAnnouncement === 'string' && options.collapsedAnnouncement.trim()
        ? options.collapsedAnnouncement
        : DEFAULT_OPTIONS.collapsedAnnouncement,
  }
}

/**
 * Counts the number of lines in a code block
 */
export function countLines(code: string): number {
  return code.split('\n').length
}

/**
 * Determines if a code block should be collapsed
 * Priority: forceNoCollapse > forceCollapse > lineThreshold
 */
export function shouldCollapse(
  codeLineCount: number,
  lineThreshold: number,
  forceCollapse: boolean | undefined,
  forceNoCollapse: boolean | undefined
): boolean {
  if (forceNoCollapse === true) {
    return false
  }
  if (forceCollapse === true) {
    return true
  }
  return codeLineCount >= lineThreshold
}
