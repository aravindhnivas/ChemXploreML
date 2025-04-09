<script lang="ts">
    import PageLayout from '$pages/PageLayout.svelte';
    import MLmodelTrain from './MLmodel/MLmodelTrain.svelte';
    import MlPredictions from './predictions/MlPredictions.svelte';
    import type { SvelteComponent } from 'svelte';

    const page_name: PAGES = 'MLTraining';
    const child_components: Record<string, typeof SvelteComponent<any>> = {
        ml_model: MLmodelTrain,
        ml_prediction: MlPredictions,
    };
</script>

<PageLayout {page_name} {child_components} />
