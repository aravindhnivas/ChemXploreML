<script lang="ts">
    import PageLayout from '$pages/PageLayout.svelte';
    import UMAP from './UMAP.svelte';
    import TSne from './T-SNE.svelte';
    import PCATrain from './PCATrain.svelte';
    import Metadata from './Metadata.svelte';
    import type { SvelteComponent } from 'svelte';

    const page_name: PAGES = 'DimenstionalityReduction';
    const child_components: Record<string, typeof SvelteComponent<any>> = {
        metadata_info: Metadata,
        pca_embedder: PCATrain,
        umap_embedder: UMAP,
        tsne_embedder: TSne,
    };
</script>

<PageLayout {page_name} {child_components} />
