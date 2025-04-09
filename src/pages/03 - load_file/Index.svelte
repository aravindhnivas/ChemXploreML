<script lang="ts">
    import PageLayout from '$pages/PageLayout.svelte';
    import AnalysisData from './AnalysisData.svelte';
    import LoadData from './LoadData.svelte';
    import type { SvelteComponent } from 'svelte';

    const page_name: PAGES = 'LoadFile';
    const child_components: Record<string, typeof SvelteComponent<any>> = {
        load_data: LoadData,
        analyse_data: AnalysisData,
    };
</script>

<PageLayout {page_name} {child_components} />
