<script lang="ts">
    import BrowseFile from '$lib/components/BrowseFile.svelte';
    import Checkbox from '$lib/components/Checkbox.svelte';
    import CustomInput from '$lib/components/CustomInput.svelte';
    import CustomSelect from '$lib/components/CustomSelect.svelte';
    import Loadingbtn from '$lib/components/Loadingbtn.svelte';
    import Molecule from '$lib/components/Molecule.svelte';
    import { NPARTITIONS, use_dask } from '$lib/stores/system';
    import { current_training_data_file } from '$pages/03 - load_file/plot-analysis/stores';
    import {
        training_column_name_X,
        training_file,
        loaded_df_columns,
        training_column_name_y,
        training_column_name_index,
    } from '$pages/03 - load_file/stores';
    import Results from './Results.svelte';
    import {
        embedd_savefile,
        embedd_savefile_path,
        embedding,
        embedding_file_download_url,
        embeddings,
        embeddings_computed,
        embedder_model_filepath,
    } from './stores';
    import LoadedFileInfos from '$lib/meta-componenets/LoadedFileInfos.svelte';
    import { BaseDirectory } from '@tauri-apps/plugin-fs';
    import DownloadModel from './DownloadModel.svelte';

    let use_built_in_models = true;

    const refresh_built_in_models = async (embedder: Embedding) => {
        const embedding_models = await path.join(await path.appLocalDataDir(), 'embedding_models');
        if (!(await fs.exists(embedding_models))) {
            await fs.mkdir('embedding_models', { baseDir: BaseDirectory.AppLocalData, recursive: true });
        }

        const model_file = await path.join(embedding_models, `${embedder}.pkl`);

        if (await fs.exists(model_file)) {
            $embedder_model_filepath[embedder] = model_file;
        }
    };

    $: if (use_built_in_models) refresh_built_in_models($embedding);

    const set_embedd_savefile = async (embedding_name: string) => {
        $embedd_savefile = `${embedding_name}_embeddings`;
    };
    $: set_embedd_savefile($embedding);

    let test_mode = false;
    const test_smiles = localWritable('test_smiles', 'CCO');
    let test_result = '';

    const embedd_data = async () => {
        if (!test_mode && !(await fs.exists(await $current_training_data_file))) {
            toast.error('Please select a file');
            return;
        }

        if (!$embedder_model_filepath[$embedding]) {
            toast.error('Please select a pretrained model');
            return;
        }

        if (!test_mode && !$training_column_name_X) {
            toast.error('Please provide a column name');
            return;
        }

        if (!test_mode && !$loaded_df_columns.includes($training_column_name_X)) {
            toast.error('Column name not found in the loaded file');
            return;
        }

        const vectors_file = await $embedd_savefile_path;
        if (!test_mode && (await fs.exists(vectors_file))) {
            const overwrite = await dialog.confirm(
                `embedd_savefile ${vectors_file} already exists. Do you want to overwrite it ?`,
                {
                    title: 'Overwrite ?',
                },
            );
            if (!overwrite) return;
        }

        // dataFromPython = {};
        dataFromPython[$embedding] = null;

        $embeddings_computed = false;
        const pyfile = 'training.embedd_data';
        const final_training_file = await $current_training_data_file;
        return {
            pyfile,
            args: {
                test_mode,
                key: $training_file.key,
                filetype: $training_file.filetype,
                filename: final_training_file,
                // df_column: $training_column_name_X,
                columnX: $training_column_name_X,
                columnY: $training_column_name_y,
                index_col: $training_column_name_index,
                embedding: $embedding,
                npartitions: $NPARTITIONS,
                test_smiles: $test_smiles,
                pretrained_model_location: $embedder_model_filepath[$embedding],
                PCA_pipeline_location: null,
                embedd_savefile: $embedd_savefile,
                vectors_file: vectors_file,
                use_dask: $use_dask,
            },
        };
    };

    const onResult = async (e: CustomEvent) => {
        const { pyfile, args } = e.detail;
        dataFromPython[args.embedding] = e.detail.dataFromPython;

        if (test_mode && dataFromPython[args.embedding].test_mode) {
            let vec = dataFromPython[args.embedding]?.test_mode?.embedded_vector;
            if (!vec) return toast.error('No data returned from python');

            test_result = `Embedded vector: ${vec.length} dimensions`;
            console.log({ vec });
            test_result += '\n[';

            for (let i = 0; i < vec.length; i += 3) {
                let chunk = vec.slice(i, i + 3).map((v: number) => v.toFixed(10));
                test_result += '\n\t' + chunk.join(',\t');
            }
            test_result += '\n]';
        } else {
            try {
                const results = await fs.readTextFile(pyfile + '.json', {
                    baseDir: fs.BaseDirectory.AppLog,
                });
                const parsed_result = results ? JSON.parse(results) : null;
                if (!parsed_result) {
                    toast.error('No data returned from python');
                    return;
                }
                const { invalid_smiles_file } = parsed_result?.file_mode;
                if (!parsed_result?.file_mode) return;

                dataFromPython[args.embedding] = parsed_result;
                const invalid_smiles_contents = await fs.readTextFile(invalid_smiles_file);
                let invalid_smiles: string[] = [];

                invalid_smiles =
                    invalid_smiles_contents
                        ?.split('\n')
                        .slice(1)
                        .filter(Boolean)
                        .map(f => f.split(',')[1]) || [];
                if (!dataFromPython[args.embedding]?.file_mode) return toast.error('No data returned from python');
                dataFromPython[args.embedding].file_mode.invalid_smiles = invalid_smiles;

                $embeddings_computed = true;
            } catch (error) {
                if (error instanceof Error) toast.error(error.message);
            }
        }
    };
    let dataFromPython = {} as Record<Embedding, EmbeddingState>;
</script>

<h3>Pre-trained model</h3>

<div class="grid justify-items-end">
    <Checkbox label="Test mode" bind:value={test_mode} />
</div>

<div class="py-2">
    <CustomSelect label="Choose embedder" bind:value={$embedding} items={embeddings} />
</div>
<!-- <Checkbox check="checkbox" label="use_built_in_models" bind:value={use_built_in_models} /> -->

{#if use_built_in_models}
    {#await fs.exists($embedder_model_filepath[$embedding]) then file_exists}
        {#if !file_exists}
            {#if $embedding_file_download_url[$embedding]}
                <DownloadModel />
            {:else}
                <div class="badge badge-md badge-error">
                    <div>
                        <span>In-built model not available to download</span>
                    </div>
                </div>
            {/if}
        {/if}
    {/await}
{/if}

{#if !use_built_in_models}
    <BrowseFile disabled={use_built_in_models} bind:filename={$embedder_model_filepath[$embedding]} label="Model" />
{/if}

{#if test_mode}
    <div class="grid gap-2">
        <div class="grid grid-cols-[auto_auto_1fr_auto] items-end gap-2">
            <CustomInput label="Enter SMILES" bind:value={$test_smiles} placeholder="Enter SMILES" />
            <Loadingbtn callback={embedd_data} on:result={onResult} />
        </div>

        <div class="grid items-center gap-1 overflow-auto">
            <Molecule bind:smiles={$test_smiles} show_controls={true} />
            <div>
                <span class="text-lg pl-1">Embedded vector</span>
                <textarea
                    class="textarea textarea-bordered h-[300px] w-full select-text"
                    placeholder="Embedded vector will be shown"
                    readonly
                    value={test_result}
                ></textarea>
            </div>
        </div>
    </div>
{:else}
    <div class="flex gap-2 items-end">
        <CustomInput label="Embeddings filename" bind:value={$embedd_savefile} lock={true} />
        <Loadingbtn callback={embedd_data} subprocess={true} on:result={onResult} />
    </div>
{/if}

{#if !test_mode}
    <div class="divider"></div>
    <h3>Loaded training file</h3>
    <LoadedFileInfos />
    <span class="badge badge-info">{$training_column_name_X} (train column X) will be used for embedding</span>
    <div class="divider"></div>
{/if}

{#if dataFromPython[$embedding]}
    {@const { file_mode, computed_time } = dataFromPython[$embedding]}
    {#if file_mode}
        <Results data={file_mode} {computed_time} />
    {/if}
{/if}
