<script lang="ts">
    import Page from '$pages/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import MLmodelTrain from './MLmodel/MLmodelTrain.svelte';
    import MlPredictions from './predictions/MlPredictions.svelte';

    const page_name = 'MLTraining';
    const child_components = [
        { id: 'ml_model', component: MLmodelTrain },
        { id: 'ml_prediction', component: MlPredictions },
    ];
</script>

<Page {page_name} pane_size={20}>
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
