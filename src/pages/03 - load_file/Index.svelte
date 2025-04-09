<script lang="ts">
    import Page from '$pages/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import AnalysisData from './AnalysisData.svelte';
    import LoadData from './LoadData.svelte';

    const page_name = 'LoadFile';
    const child_components = [
        { id: 'load_data', component: LoadData },
        { id: 'analyse_data', component: AnalysisData },
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
