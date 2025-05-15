<script lang="ts">
    import PageLayout from '$pages/PageLayout.svelte';
    import MoleculeAnalysis from './MoleculeAnalysis.svelte';
    const page_name: PAGES = 'MolecularAnalysis';
</script>

<PageLayout {page_name} component={MoleculeAnalysis} />
