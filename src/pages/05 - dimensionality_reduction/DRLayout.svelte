<script lang="ts">
    import { CustomSelect } from '$lib/components';
    import SaveAndLoadState from '$lib/components/SaveAndLoadState.svelte';
    import { embedding, embeddings } from '$pages/04 - embedd_molecule/stores';
    import { loaded_files } from './stores';

    export let loc: string;
    export let default_params: Record<string, any>;
    export let params: Record<string, any>;
    export let unique_ext: string;
    export let name: 'pca' | 'umap' | 't-sne';

    const get_umap_loc = async (processed_df_file: string) => {
        if (!processed_df_file) return;
        const dir = await path.dirname(processed_df_file);
        loc = await path.join(dir, name);
        if (!(await fs.exists(loc))) return;
    };

    $: get_umap_loc($loaded_files?.final_processed_file?.value);
</script>

<CustomSelect bind:value={$embedding} items={embeddings} label="Embedder" />
<SaveAndLoadState {loc} {default_params} bind:params {unique_ext} />
