<script lang="ts">
    import Page from '$pages/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import MoleculeAnalysis from './MoleculeAnalysis.svelte';
    import { Settings } from 'lucide-svelte/icons';
</script>

<Page page_name="MolecularAnalysis">
    <svelte:fragment let:page>
        <Pane>
            <div class="bg-base-200/15 overflow-auto h-full mx-3 px-5 py-2 rounded-xl">
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
                <MoleculeAnalysis />
            </div>
        </Pane>
    </svelte:fragment>
</Page>
