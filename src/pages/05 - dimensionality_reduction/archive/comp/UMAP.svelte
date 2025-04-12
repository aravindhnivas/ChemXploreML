<script lang="ts">
    import DrLayout from './DRLayout.svelte';

    let params: Record<string, number | string> = {};
    let umap_loc = '';
</script>

<DrLayout bind:loc={umap_loc} bind:params name="UMAP"></DrLayout>
