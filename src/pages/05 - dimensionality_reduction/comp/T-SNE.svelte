<script lang="ts">
    import DrLayout from './DRLayout.svelte';

    let params: Record<string, number | string> = {};
    let tsne_loc = '';
</script>

<DrLayout bind:loc={tsne_loc} bind:params name="t-SNE"></DrLayout>
