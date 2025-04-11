<script lang="ts">
    import PageLayout from '$pages/PageLayout.svelte';
    import UMAP from './comp/UMAP.svelte';
    import TSne from './comp/T-SNE.svelte';
    import PCA from './comp/PCA.svelte';
    import Metadata from './Metadata.svelte';
    import type { SvelteComponent } from 'svelte';

    const page_name: PAGES = 'DimenstionalityReduction';
    const child_components: Record<string, typeof SvelteComponent<any>> = {
        metadata_info: Metadata,
        pca_embedder: PCA,
        umap_embedder: UMAP,
        tsne_embedder: TSne,
    };
</script>

<PageLayout {page_name} {child_components} />
