<script>
    import Page from '$lib/layouts/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import { Mol2VecTrain, VICGAETrain, PCATrain } from '.';

    let active_item = 'Mol2Vec';
</script>

<Page id="Train Embedder">
    <svelte:fragment slot="body">
        <Pane class="p-2" size={10} minSize={5} maxSize={20}>
            <ul class="menu rounded-box gap-2">
                <li on:click={() => (active_item = 'Mol2Vec')}>
                    <span class:active={active_item == 'Mol2Vec'}>Mol2Vec</span>
                </li>
                <li on:click={() => (active_item = 'VICGAE')}>
                    <span class:active={active_item == 'VICGAE'}>
                        <span>VICGAE</span>
                    </span>
                </li>
                <li on:click={() => (active_item = 'PCA')}>
                    <span class:active={active_item == 'PCA'}>PCA</span>
                </li>
            </ul>
        </Pane>
        <Pane minSize={80}>
            <div class="overflow-auto max-h-[100%] p-2">
                <Mol2VecTrain display={active_item.toLowerCase() === 'mol2vec' ? '' : 'none'} />
                <VICGAETrain display={active_item.toLowerCase() === 'vicgae' ? '' : 'none'} />
                <PCATrain display={active_item.toLowerCase() === 'pca' ? '' : 'none'} />
            </div>
        </Pane>
    </svelte:fragment>
</Page>
