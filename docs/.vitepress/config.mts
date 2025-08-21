import { defineConfig } from 'vitepress';
import { sidebar } from './sidebar';
import lightbox from 'vitepress-plugin-lightbox';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'ChemXploreML',
    description: 'A documentation site for ChemXploreML application',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            // { text: "GitHub", link: "https://github.com/aravindhnivas/chemxploreml" },
        ],
        sidebar,
        socialLinks: [{ icon: 'github', link: 'https://github.com/aravindhnivas/chemxploreml/' }],
        logo: '/icon.png',
        search: {
            provider: 'local',
        },
    },
    base: '/ChemXploreML/',
    head: [['link', { rel: 'icon', type: 'image/x-icon', href: '/ChemXploreML/icon.ico' }]],
    ignoreDeadLinks: true,
    markdown: {
        config: md => {
            md.use(lightbox, {});
        },
    },
});
