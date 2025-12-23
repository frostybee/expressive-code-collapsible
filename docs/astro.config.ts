import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://frostybee.github.io',
  base: '/expressive-code-collapsible',
  integrations: [
    starlight({
      title: 'Expressive Code Collapsible',
      description: 'Collapsible code blocks plugin for Expressive Code. Automatically collapse long code blocks with expand/collapse controls.',
      editLink: {
        baseUrl: 'https://github.com/frostybee/expressive-code-collapsible/edit/main/docs/',
      },
      sidebar: [
        {
          label: 'Start Here',
          items: ['getting-started', 'configuration'],
        },
        {
          label: 'Demos',
          items: ['demos/examples'],
        },
      ],
      social: [
        { href: 'https://github.com/frostybee/expressive-code-collapsible', icon: 'github', label: 'GitHub' },
      ],
    }),
  ],
})
