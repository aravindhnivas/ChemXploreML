<script lang="ts">
    import PageLayout from '$pages/PageLayout.svelte';
    import MoleculeAnalysis from './MoleculeAnalysis.svelte';
    import Checkbox from '$lib/components/Checkbox.svelte';
    const page_name: PAGES = 'MolecularAnalysis';
</script>

<PageLayout {page_name} component={MoleculeAnalysis}>
    <svelte:fragment slot="modal">
        <Checkbox label="Checking" />
    </svelte:fragment>
</PageLayout>
