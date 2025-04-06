<script lang="ts">
    import Page from '$lib/layouts/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import UMAP from './UMAP.svelte';
    import TSne from './T-SNE.svelte';
    import MetaInfo from './MetaInfo.svelte';
</script>

<Page page_name="UMAP">
    <svelte:fragment slot="body" let:active_children>
        <Pane minSize={80}>
            <div class="overflow-auto max-h-[100%] p-2">
                <MetaInfo display={active_children === 'meta_infos' ? '' : 'none'} />
                <UMAP display={active_children === 'umap_embedder' ? '' : 'none'} />
                <TSne display={active_children === 'tsne_embedder' ? '' : 'none'} />
            </div>
        </Pane>
    </svelte:fragment>
</Page>
