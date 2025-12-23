import { pluginCollapsible } from 'expressive-code-collapsible'
import { pluginLanguageBadge } from 'expressive-code-language-badge'
import { pluginFullscreen } from 'expressive-code-fullscreen'

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export default {
  plugins: [pluginCollapsible(), pluginLanguageBadge(), pluginFullscreen()],
}
