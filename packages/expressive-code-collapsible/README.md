<div align="center">
  <h1>Expressive Code Collapsible</h1>
  <p>A plugin for Expressive Code that adds collapsible functionality to code blocks, automatically collapsing long code with expand/collapse controls.</p>

  [![npm version](https://badge.fury.io/js/expressive-code-collapsible.svg)](https://badge.fury.io/js/expressive-code-collapsible)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

## Features

- Long code blocks automatically collapse based on a configurable line threshold
- Force collapse or expand on any block using `collapse` or `nocollapse` meta strings
- Toggle buttons appear both as an overlay and in the header (when a title is present)
- Animated transitions that respect `prefers-reduced-motion`
- Accessible with ARIA attributes and customizable screen reader announcements
- Works with Starlight, Astro, Next.js, and standalone Expressive Code setups

## Installation

Install the plugin using your preferred package manager:

```bash
npm install expressive-code-collapsible
```

## Quick Start

```js
import { pluginCollapsible } from 'expressive-code-collapsible';

// Add to your Expressive Code configuration
plugins: [pluginCollapsible()]
```

## Documentation

For comprehensive documentation, installation guides, configuration options, and examples, visit the [plugin documentation](https://frostybee.github.io/expressive-code-collapsible/).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

Licensed under the MIT License, Copyright © frostybee.

See [LICENSE](/LICENSE) for more information.

## Links

- [GitHub Repository](https://github.com/frostybee/expressive-code-collapsible)
- [npm Package](https://www.npmjs.com/package/expressive-code-collapsible)
- [Documentation](https://frostybee.github.io/expressive-code-collapsible/)
- [Issues](https://github.com/frostybee/expressive-code-collapsible/issues)
