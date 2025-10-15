// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Podcast Framework',
			description: 'Build beautiful podcast websites with Astro, TypeScript, and Sanity CMS',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/podcast-framework/podcast-framework' },
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Overview', slug: 'getting-started/overview' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Project Structure', slug: 'getting-started/project-structure' },
						{ label: 'Configuration', slug: 'getting-started/configuration' },
					],
				},
				{
					label: 'Components',
					items: [
						{ label: 'Overview', slug: 'components/overview' },
						{ label: 'Header', slug: 'components/header' },
						{ label: 'Footer', slug: 'components/footer' },
					],
				},
			],
		}),
	],
});
