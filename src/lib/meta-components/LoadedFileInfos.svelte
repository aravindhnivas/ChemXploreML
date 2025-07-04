<script lang="ts">
    import { current_training_data_file } from '$pages/03 - load_file/plot-analysis/stores';
    import { embedd_savefile_path, processed_df } from '$pages/04 - embedd_molecule/stores';
    import { training_column_name_X, training_column_name_y } from '$pages/03 - load_file/stores';
    import { RefreshCcw, ExternalLink } from 'lucide-svelte/icons';
    import { all_files_loaded, loaded_files } from './stores';

    let refresh = false;

    const dispatch = createEventDispatcher();

    const items = [
        { name: 'Training file', key: 'training_file' },
        { name: 'Embedded vector file', key: 'embedded_file' },
        { name: 'Train X', key: 'columnX' },
        { name: 'Train y', key: 'columnY' },
        { name: 'Final processed file', key: 'final_processed_file' },
    ] as const;

    let metadata: { data_shape: number[]; invalid_smiles: number } | null = null;

    // let loaded_files: LoadedInfosFile;
    const refresh_data = async (
        tfile: Promise<string>,
        vfile: Promise<string>,
        columnX: string,
        columnY: string,
        processed_df: Promise<string>,
        refresh: boolean,
    ) => {
        try {
            console.log(`force re-load`, refresh); // for force-reloading don't remove
            metadata = null;
            $all_files_loaded = false;

            $loaded_files = {
                training_file: { value: '', valid: false, basename: '' },
                embedded_file: { value: '', valid: false, basename: '' },
                columnX: { value: '', valid: false, basename: '' },
                columnY: { value: '', valid: false, basename: '' },
                final_processed_file: { value: '', valid: false, basename: '' },
            };

            const [_training_file, _embedded_file, _processed_df] = await Promise.all([tfile, vfile, processed_df]);
            const vector_metadata_file = _embedded_file.replace('.npy', '.metadata.json');

            $loaded_files.training_file = {
                value: _training_file,
                valid: await fs.exists(_training_file),
                basename: await path.basename(_training_file),
            };
            $loaded_files.embedded_file = {
                value: _embedded_file,
                valid: await fs.exists(_embedded_file),
                basename: await path.basename(_embedded_file),
            };
            $loaded_files.columnX = { value: columnX, valid: columnX !== '', basename: columnX };
            $loaded_files.columnY = { value: columnY, valid: columnY !== '', basename: columnY };

            $loaded_files.final_processed_file = {
                value: _processed_df,
                valid: await fs.exists(_processed_df),
                basename: await path.basename(_processed_df),
            };
            $all_files_loaded = true;

            if (!(await fs.exists(vector_metadata_file))) return $loaded_files;
            const _metadata = await readJSON<{ data_shape: number[]; invalid_smiles: number }>(vector_metadata_file);
            if (_metadata) metadata = _metadata;

            dispatch('refresh', $loaded_files);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    $: refresh_data(
        $current_training_data_file,
        $embedd_savefile_path,
        $training_column_name_X,
        $training_column_name_y,
        $processed_df,
        refresh,
    );

    onMount(() => {
        refresh = !refresh;
    });
</script>

<div class="flex-gap">
    <button class="w-max btn btn-sm btn-outline" on:click={() => (refresh = !refresh)}>
        <span>Refresh</span>
        <RefreshCcw size="20" />
    </button>
    <button
        class="btn btn-sm btn-outline"
        on:click={async () => {
            try {
                if (!$loaded_files) return;
                const dir = await path.dirname($loaded_files.embedded_file.value);
                await open_filepath(await path.dirname(dir));
            } catch (error) {
                toast.error(error);
            }
        }}
    >
        <span>Open folder</span>
        <ExternalLink size="20" />
    </button>
</div>

{#if $all_files_loaded}
    <div class="grid gap-2 grid-cols-4 items-center">
        {#each items as { name, key }}
            {@const { value, valid } = $loaded_files[key]}
            <div>{name}:</div>
            <div class="col-span-3 border-rounded" class:bg-error={!valid}>
                <code class="break-all text-sm p-1" class:bg-success={valid}>{value}</code>
            </div>
        {/each}
        {#if metadata?.data_shape || metadata?.invalid_smiles}
            <div class="divider col-span-4"></div>
            <div>Data shape (n_samples, n_features):</div>
            <div class="col-span-3 border-rounded">({metadata.data_shape?.join(', ')})</div>
            {#if metadata.invalid_smiles === 0}
                <div class="col-span-4 badge">All SMILES are valid - encoded</div>
            {:else}
                <div>Invalid SMILES embedding:</div>
                <div class="col-span-3 border-rounded">{metadata.invalid_smiles}</div>
                <div>Total valid SMILES embedding:</div>
                <div>{metadata.data_shape[0] - metadata.invalid_smiles}</div>
            {/if}
        {:else}
            <div class="badge badge-sm badge-error">No metadata file available</div>
        {/if}
    </div>
{/if}
