<script lang="ts">
    import PageLayout from '$pages/PageLayout.svelte';
    import Embedding from './Embedding.svelte';

    const page_name: PAGES = 'EmbeddMolecule';
</script>

<PageLayout {page_name} component={Embedding} />
