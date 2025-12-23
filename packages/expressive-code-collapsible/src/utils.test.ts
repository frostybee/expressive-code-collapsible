import { describe, it, expect } from 'vitest'
import { DEFAULT_OPTIONS, resolveOptions, countLines, shouldCollapse } from './utils'

describe('DEFAULT_OPTIONS', () => {
  it('should have correct default values', () => {
    expect(DEFAULT_OPTIONS.lineThreshold).toBe(15)
    expect(DEFAULT_OPTIONS.previewLines).toBe(8)
    expect(DEFAULT_OPTIONS.defaultCollapsed).toBe(true)
    expect(DEFAULT_OPTIONS.expandButtonText).toBe('Show more')
    expect(DEFAULT_OPTIONS.collapseButtonText).toBe('Show less')
  })
})

describe('resolveOptions', () => {
  describe('default values', () => {
    it('should return all defaults when no options provided', () => {
      const config = resolveOptions()
      expect(config.lineThreshold).toBe(15)
      expect(config.previewLines).toBe(8)
      expect(config.defaultCollapsed).toBe(true)
      expect(config.expandButtonText).toBe('Show more')
      expect(config.collapseButtonText).toBe('Show less')
    })

    it('should return all defaults when empty object provided', () => {
      const config = resolveOptions({})
      expect(config).toEqual(DEFAULT_OPTIONS)
    })
  })

  describe('user overrides', () => {
    it('should override lineThreshold when provided', () => {
      const config = resolveOptions({ lineThreshold: 20 })
      expect(config.lineThreshold).toBe(20)
    })

    it('should override previewLines when provided', () => {
      const config = resolveOptions({ previewLines: 10 })
      expect(config.previewLines).toBe(10)
    })

    it('should override defaultCollapsed when provided', () => {
      const config = resolveOptions({ defaultCollapsed: false })
      expect(config.defaultCollapsed).toBe(false)
    })

    it('should override expandButtonText when provided', () => {
      const config = resolveOptions({ expandButtonText: 'Show code' })
      expect(config.expandButtonText).toBe('Show code')
    })

    it('should override collapseButtonText when provided', () => {
      const config = resolveOptions({ collapseButtonText: 'Hide code' })
      expect(config.collapseButtonText).toBe('Hide code')
    })

    it('should override multiple options', () => {
      const config = resolveOptions({
        lineThreshold: 25,
        previewLines: 10,
        defaultCollapsed: false,
      })
      expect(config.lineThreshold).toBe(25)
      expect(config.previewLines).toBe(10)
      expect(config.defaultCollapsed).toBe(false)
      // Non-overridden should remain default
      expect(config.expandButtonText).toBe('Show more')
      expect(config.collapseButtonText).toBe('Show less')
    })

  })

  describe('validation - invalid values fall back to defaults', () => {
    it('should fall back to default when lineThreshold is zero', () => {
      const config = resolveOptions({ lineThreshold: 0 })
      expect(config.lineThreshold).toBe(DEFAULT_OPTIONS.lineThreshold)
    })

    it('should fall back to default when lineThreshold is negative', () => {
      const config = resolveOptions({ lineThreshold: -5 })
      expect(config.lineThreshold).toBe(DEFAULT_OPTIONS.lineThreshold)
    })

    it('should fall back to default when previewLines is zero', () => {
      const config = resolveOptions({ previewLines: 0 })
      expect(config.previewLines).toBe(DEFAULT_OPTIONS.previewLines)
    })

    it('should fall back to default when previewLines is negative', () => {
      const config = resolveOptions({ previewLines: -3 })
      expect(config.previewLines).toBe(DEFAULT_OPTIONS.previewLines)
    })

    it('should fall back to default when expandButtonText is empty', () => {
      const config = resolveOptions({ expandButtonText: '' })
      expect(config.expandButtonText).toBe(DEFAULT_OPTIONS.expandButtonText)
    })

    it('should fall back to default when expandButtonText is whitespace only', () => {
      const config = resolveOptions({ expandButtonText: '   ' })
      expect(config.expandButtonText).toBe(DEFAULT_OPTIONS.expandButtonText)
    })

    it('should fall back to default when collapseButtonText is empty', () => {
      const config = resolveOptions({ collapseButtonText: '' })
      expect(config.collapseButtonText).toBe(DEFAULT_OPTIONS.collapseButtonText)
    })

    it('should fall back to default when collapseButtonText is whitespace only', () => {
      const config = resolveOptions({ collapseButtonText: '\t\n' })
      expect(config.collapseButtonText).toBe(DEFAULT_OPTIONS.collapseButtonText)
    })

    it('should accept minimum valid values', () => {
      const config = resolveOptions({ lineThreshold: 1, previewLines: 1 })
      expect(config.lineThreshold).toBe(1)
      expect(config.previewLines).toBe(1)
    })
  })
})

describe('countLines', () => {
  describe('basic line counting', () => {
    it('should count single line code', () => {
      expect(countLines('console.log("hello")')).toBe(1)
    })

    it('should count two lines', () => {
      expect(countLines('line 1\nline 2')).toBe(2)
    })

    it('should count three lines', () => {
      const code = `line 1
line 2
line 3`
      expect(countLines(code)).toBe(3)
    })

    it('should count exactly 15 lines (default threshold)', () => {
      const code = Array(15).fill('line').join('\n')
      expect(countLines(code)).toBe(15)
    })

    it('should count many lines', () => {
      const code = Array(100).fill('line').join('\n')
      expect(countLines(code)).toBe(100)
    })
  })

  describe('edge cases', () => {
    it('should return 1 for empty string', () => {
      // "".split("\n") returns [""], which has length 1
      expect(countLines('')).toBe(1)
    })

    it('should handle trailing newline', () => {
      const code = 'line 1\nline 2\n'
      // This results in ["line 1", "line 2", ""] = 3 elements
      expect(countLines(code)).toBe(3)
    })

    it('should handle multiple trailing newlines', () => {
      const code = 'line 1\n\n\n'
      expect(countLines(code)).toBe(4)
    })

    it('should handle only newlines', () => {
      expect(countLines('\n')).toBe(2)
      expect(countLines('\n\n')).toBe(3)
      expect(countLines('\n\n\n')).toBe(4)
    })

    it('should handle code with blank lines in the middle', () => {
      const code = 'line 1\n\nline 3'
      expect(countLines(code)).toBe(3)
    })

    it('should handle Windows-style line endings (CRLF)', () => {
      // Note: current implementation splits on \n only
      // \r\n will split on \n, leaving \r at end of lines
      const code = 'line 1\r\nline 2\r\nline 3'
      expect(countLines(code)).toBe(3)
    })
  })
})

describe('shouldCollapse', () => {
  const DEFAULT_THRESHOLD = 15

  describe('priority: forceNoCollapse takes precedence', () => {
    it('should return false when forceNoCollapse is true, regardless of line count', () => {
      expect(shouldCollapse(100, DEFAULT_THRESHOLD, undefined, true)).toBe(false)
    })

    it('should return false when forceNoCollapse is true, even if forceCollapse is true', () => {
      expect(shouldCollapse(5, DEFAULT_THRESHOLD, true, true)).toBe(false)
    })

    it('should return false when forceNoCollapse is true and above threshold', () => {
      expect(shouldCollapse(50, DEFAULT_THRESHOLD, undefined, true)).toBe(false)
    })
  })

  describe('priority: forceCollapse over threshold', () => {
    it('should return true when forceCollapse is true and below threshold', () => {
      expect(shouldCollapse(5, DEFAULT_THRESHOLD, true, undefined)).toBe(true)
    })

    it('should return true when forceCollapse is true and at threshold', () => {
      expect(shouldCollapse(15, DEFAULT_THRESHOLD, true, undefined)).toBe(true)
    })

    it('should return true when forceCollapse is true and above threshold', () => {
      expect(shouldCollapse(100, DEFAULT_THRESHOLD, true, undefined)).toBe(true)
    })
  })

  describe('threshold-based collapsing', () => {
    it('should return false when below threshold', () => {
      expect(shouldCollapse(10, DEFAULT_THRESHOLD, undefined, undefined)).toBe(false)
    })

    it('should return false when one below threshold', () => {
      expect(shouldCollapse(14, DEFAULT_THRESHOLD, undefined, undefined)).toBe(false)
    })

    it('should return true when exactly at threshold', () => {
      expect(shouldCollapse(15, DEFAULT_THRESHOLD, undefined, undefined)).toBe(true)
    })

    it('should return true when one above threshold', () => {
      expect(shouldCollapse(16, DEFAULT_THRESHOLD, undefined, undefined)).toBe(true)
    })

    it('should return true when well above threshold', () => {
      expect(shouldCollapse(100, DEFAULT_THRESHOLD, undefined, undefined)).toBe(true)
    })

    it('should work with custom thresholds', () => {
      expect(shouldCollapse(5, 10, undefined, undefined)).toBe(false)
      expect(shouldCollapse(10, 10, undefined, undefined)).toBe(true)
      expect(shouldCollapse(15, 10, undefined, undefined)).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle zero line count', () => {
      expect(shouldCollapse(0, DEFAULT_THRESHOLD, undefined, undefined)).toBe(false)
    })

    it('should handle zero threshold (always collapse)', () => {
      expect(shouldCollapse(1, 0, undefined, undefined)).toBe(true)
      expect(shouldCollapse(0, 0, undefined, undefined)).toBe(true)
    })

    it('should handle single line with threshold of 1', () => {
      expect(shouldCollapse(1, 1, undefined, undefined)).toBe(true)
    })

    it('should handle negative threshold gracefully', () => {
      // Any positive line count >= negative threshold
      expect(shouldCollapse(1, -1, undefined, undefined)).toBe(true)
    })

    it('should handle all undefined meta options (typical scenario)', () => {
      expect(shouldCollapse(20, 15, undefined, undefined)).toBe(true)
      expect(shouldCollapse(10, 15, undefined, undefined)).toBe(false)
    })

    it('should handle forceCollapse as false (explicit)', () => {
      // When forceCollapse is explicitly false, fall through to threshold
      expect(shouldCollapse(5, DEFAULT_THRESHOLD, false, undefined)).toBe(false)
      expect(shouldCollapse(20, DEFAULT_THRESHOLD, false, undefined)).toBe(true)
    })

    it('should handle forceNoCollapse as false (explicit)', () => {
      // When forceNoCollapse is explicitly false, it doesn't block collapse
      expect(shouldCollapse(20, DEFAULT_THRESHOLD, undefined, false)).toBe(true)
      expect(shouldCollapse(5, DEFAULT_THRESHOLD, true, false)).toBe(true)
    })
  })
})
