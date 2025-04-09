<script lang="ts">
    import Page from '$pages/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import UMAP from './UMAP.svelte';
    import TSne from './T-SNE.svelte';
    import PCATrain from './PCATrain.svelte';
    import type { SvelteComponent } from 'svelte';
    import { Settings } from 'lucide-svelte/icons';

    const page_name: PAGES = 'DimenstionalityReduction';
    const components: Record<string, typeof SvelteComponent<any>> = {
        pca_embedder: PCATrain,
        umap_embedder: UMAP,
        tsne_embedder: TSne,
    };
</script>

<Page {page_name}>
    <svelte:fragment let:active_children let:page>
        <Pane minSize={80}>
            <div class="bg-base-200/15 overflow-auto h-full mx-3 px-5 py-2 rounded-xl">
                {#each page.children as { id, title, description }}
                    <div {id} style:display={active_children === id ? '' : 'none'} class="grid gap-2">
                        <div class="grid gap-2">
                            <div class="flex justify-between">
                                <h1>{title}</h1>
                                <button class="btn btn-sm btn-outline btn-square">
                                    <Settings />
                                </button>
                            </div>
                            <span class="text-md">{description}</span>
                        </div>
                        <div class="divider"></div>
                        <svelte:component this={components[id]} />
                    </div>
                {:else}
                    <div class="grid gap-2">
                        <div class="flex justify-between">
                            <h1>{page.title}</h1>
                            <button class="btn btn-sm btn-outline btn-square">
                                <Settings />
                            </button>
                        </div>
                        <span class="text-md">{page.description}</span>
                    </div>

                    <div class="divider"></div>
                {/each}
            </div>
        </Pane>
    </svelte:fragment>
</Page>
