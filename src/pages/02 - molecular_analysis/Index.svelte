<script lang="ts">
    import Page from '$pages/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import MoleculeAnalysis from './MoleculeAnalysis.svelte';
</script>

<Page page_name="MolecularAnalysis">
    <svelte:fragment let:page_title>
        <Pane>
            <div class="bg-base-200/15 overflow-auto h-full mx-3 px-5 py-2 rounded-xl">
                <MoleculeAnalysis />
            </div>
        </Pane>
    </svelte:fragment>
</Page>
