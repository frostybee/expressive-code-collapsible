import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import expressiveCodeCollapsible from 'expressive-code-collapsible'

export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl: 'https://github.com/frostybee/expressive-code-collapsible/edit/main/docs/',
      },
      plugins: [expressiveCodeCollapsible()],
      sidebar: [
        {
          label: 'Start Here',
          items: ['getting-started'],
        },
      ],
      social: [
        { href: 'https://github.com/frostybee/expressive-code-collapsible', icon: 'github', label: 'GitHub' },
      ],
      title: 'expressive-code-collapsible',
    }),
  ],
})
