// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://podcast-framework.rejected.media',
	integrations: [
		starlight({
			title: 'Podcast Framework',
			description: 'Build beautiful podcast websites with Astro, TypeScript, and Sanity CMS',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/rejected-media/podcast-framework' },
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
						{ label: 'Newsletter Signup', slug: 'components/newsletter-signup' },
						{ label: 'Episode Search', slug: 'components/episode-search' },
						{ label: 'Transcript Viewer', slug: 'components/transcript-viewer' },
						{ label: 'Featured Episodes Carousel', slug: 'components/featured-episodes-carousel' },
						{ label: 'Skeleton Loader', slug: 'components/skeleton-loader' },
						{ label: 'Block Content', slug: 'components/block-content' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'Utilities', slug: 'api/utilities' },
						{ label: 'Theme System', slug: 'api/theme' },
						{ label: 'Sanity Helpers', slug: 'api/sanity-helpers' },
						{ label: 'Static Paths', slug: 'api/static-paths' },
						{ label: 'Hosting Adapter', slug: 'api/hosting-adapter' },
						{ label: 'Server Services', slug: 'api/server-services' },
					],
				},
				{
					label: 'Sanity CMS',
					items: [
						{ label: 'Setup', slug: 'sanity/setup' },
						{ label: 'Schemas', slug: 'sanity/schemas' },
						{ label: 'Content Management', slug: 'sanity/content-management' },
						{ label: 'Theme Configuration', slug: 'sanity/theme-configuration' },
						{ label: 'Homepage Configuration', slug: 'sanity/homepage-configuration' },
						{ label: 'About Page Configuration', slug: 'sanity/about-page-configuration' },
					],
				},
				{
					label: 'Deployment',
					items: [
						{ label: 'Cloudflare Pages', slug: 'deployment/cloudflare-pages' },
						{ label: 'Netlify', slug: 'deployment/netlify' },
						{ label: 'Vercel', slug: 'deployment/vercel' },
						{ label: 'Environment Variables', slug: 'deployment/environment-variables' },
						{ label: 'Custom Domains', slug: 'deployment/custom-domains' },
					],
				},
				{
					label: 'Customization',
					items: [
						{ label: 'Component Overrides', slug: 'customization/component-overrides' },
						{ label: 'Theming', slug: 'customization/theming' },
					],
				},
				{
					label: 'Examples',
					items: [
						{ label: 'Basic Podcast', slug: 'examples/basic-podcast' },
						{ label: 'Custom Theme', slug: 'examples/custom-theme' },
					],
				},
				{
					label: 'Contributing',
					items: [
						{ label: 'Contributing Guidelines', slug: 'contributing/guidelines' },
						{ label: 'Development Setup', slug: 'contributing/development-setup' },
					],
				},
			],
		}),
	],
});
