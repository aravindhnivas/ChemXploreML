<script lang="ts">
    import Page from '$lib/layouts/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import { Embedding, MLmodelTrain, TrainingFile } from '.';
    import MlPredictions from './predictions/MlPredictions.svelte';

    const page_name = 'Training';
</script>

<Page {page_name}>
    <svelte:fragment slot="body" let:active_children>
        <Pane minSize={80}>
            <div class="overflow-auto max-h-[100%] p-2">
                <TrainingFile display={active_children === 'load_file' ? '' : 'none'} />
                <Embedding display={active_children === 'embedding' ? '' : 'none'} />
                <MLmodelTrain display={active_children === 'ml_model' ? '' : 'none'} />
                <MlPredictions display={active_children === 'ml_prediction' ? '' : 'none'} />
            </div>
        </Pane>
    </svelte:fragment>
</Page>
