<script lang="ts">
    import DrLayout from './DRLayout.svelte';
    let params: Record<string, number | string> = {};
    let pca_loc = '';
</script>

<DrLayout bind:loc={pca_loc} bind:params name="PCA"></DrLayout>
