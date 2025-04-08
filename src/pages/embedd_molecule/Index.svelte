<script lang="ts">
    import Page from '$lib/layouts/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import Embedding from './Embedding.svelte';
    const page_name = 'EmbeddMolecule';
</script>

<Page {page_name}>
    <svelte:fragment slot="body">
        <Pane minSize={80}>
            <div class="overflow-auto max-h-[100%] p-2">
                <Embedding />
            </div>
        </Pane>
    </svelte:fragment>
</Page>
