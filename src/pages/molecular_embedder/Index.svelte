<script lang="ts">
    import Page from '$lib/layouts/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import { Mol2VecTrain, VICGAETrain, PCATrain } from '.';
</script>

<Page page_name="MolecularEmbedder">
    <svelte:fragment slot="body" let:active_children>
        <Pane minSize={80}>
            <div class="overflow-auto max-h-[100%] p-2">
                <Mol2VecTrain display={active_children.toLowerCase() === 'mol2vec' ? '' : 'none'} />
                <VICGAETrain display={active_children.toLowerCase() === 'vicgae' ? '' : 'none'} />
                <PCATrain display={active_children.toLowerCase() === 'pca' ? '' : 'none'} />
            </div>
        </Pane>
    </svelte:fragment>
</Page>
