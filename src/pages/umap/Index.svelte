<script lang="ts">
    import Page from '$lib/layouts/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import UMAP from './UMAP.svelte';

    let active_item = 'umap_embedder';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<Page id="UMAP/t-SNE">
    <svelte:fragment slot="body">
        <Pane class="p-2" size={10} minSize={5} maxSize={20}>
            <ul class="menu rounded-box gap-1">
                <li on:click={() => (active_item = 'umap_embedder')}>
                    <span class:active={active_item == 'umap_embedder'}>UMAP</span>
                </li>
                <li on:click={() => (active_item = 'tsne_embedder')}>
                    <span class:active={active_item == 'tsne_embedder'}>t-SNE</span>
                </li>
            </ul>
        </Pane>
        <Pane minSize={80}>
            <div class="overflow-auto max-h-[100%] p-2">
                <UMAP display={active_item.toLowerCase() === 'umap_embedder' ? '' : 'none'} />
            </div>
        </Pane>
    </svelte:fragment>
</Page>
