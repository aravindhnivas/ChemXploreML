<script lang="ts">
    import Page from '$pages/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import Embedding from './Embedding.svelte';
    const page_name = 'EmbeddMolecule';
</script>

<Page {page_name}>
    <svelte:fragment>
        <Pane minSize={80}>
            <div class="bg-base-200/15 overflow-auto h-full mx-3 px-5 py-2 rounded-xl">
                <Embedding />
            </div>
        </Pane>
    </svelte:fragment>
</Page>
