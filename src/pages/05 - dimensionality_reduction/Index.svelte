<script lang="ts">
    import PageLayout from '$pages/PageLayout.svelte';
    import Metadata from './Metadata.svelte';
    import type { SvelteComponent } from 'svelte';
    import { dr_methods } from './stores';
    import DRLayoutWrapper from './DRLayoutWrapper.svelte';

    const page_name: PAGES = 'DimenstionalityReduction';

    const child_components: Record<string, typeof SvelteComponent<any>> = {
        metadata_info: Metadata,
    };

    for (const name of dr_methods) {
        const key = name.toLowerCase().replace(/-/g, '_') + '_embedder';
        child_components[key] = class extends DRLayoutWrapper {
            constructor(options: any) {
                super({ ...options, props: { ...options.props, name } });
            }
        };
    }
    console.log(child_components);
</script>

<PageLayout {page_name} {child_components} />
