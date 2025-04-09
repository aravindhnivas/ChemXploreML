<script lang="ts">
    import Page from '$pages/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import UMAP from './UMAP.svelte';
    import TSne from './T-SNE.svelte';
    import PCATrain from './PCATrain.svelte';

    const page_name = 'DimenstionalityReduction';
    const child_components = [
        { id: 'pca_embedder', component: PCATrain },
        { id: 'umap_embedder', component: UMAP },
        { id: 'tsne_embedder', component: TSne },
    ];
</script>

<Page {page_name}>
    <svelte:fragment let:active_children>
        <Pane minSize={80}>
            <div class="overflow-auto max-h-[100%] p-2">
                {#each child_components as { id, component }}
                    <div {id} style:display={active_children === id ? '' : 'none'} class="grid gap-2">
                        <svelte:component this={component} />
                    </div>
                {/each}
            </div>
        </Pane>
    </svelte:fragment>
</Page>
