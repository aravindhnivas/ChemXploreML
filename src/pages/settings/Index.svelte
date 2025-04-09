<script lang="ts">
    import PageLayout from '$pages/PageLayout.svelte';
    import { Configuration, Console, System, Update, ProcessMonitor, Credit, License } from '.';
    import type { SvelteComponent } from 'svelte';

    const page_name: PAGES = 'Settings';
    const child_components: Record<string, typeof SvelteComponent<any>> = {
        configuration: Configuration,
        update: Update,
        console: Console,
        'process-monitor': ProcessMonitor,
        system: System,
        credit: Credit,
        license: License,
    };
</script>

<PageLayout {page_name} {child_components} />
