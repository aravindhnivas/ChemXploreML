<script lang="ts">
    import { use_filtered_data_for_training, filtered_dir } from './plot-analysis/stores';
    import { use_dask } from '$lib/stores/system';
    import { NPARTITIONS } from '$lib/stores/system';
    import {
        training_file,
        training_column_name_X,
        training_column_name_y,
        training_column_name_index,
        index_column_valid,
        training_save_directory,
        loaded_df_columns,
        training_state_loaded,
    } from './stores';
    import FileLoader from '$lib/components/fileloader/FileLoader.svelte';
    import CustomSelect from '$lib/components/CustomSelect.svelte';
    import { CustomInput, Loadingbtn } from '$lib/components';
    import FetchAnalysisDir from './FetchAnalysisDir.svelte';
    import LoadedFileInfos from '$lib/meta-components/LoadedFileInfos.svelte';
    import { Download, Save } from 'lucide-svelte/icons';
    import Checkbox from '$lib/components/Checkbox.svelte';
    import Accordion from '@smui-extra/accordion';
    import CustomPanel from '$lib/components/CustomPanel.svelte';

    let auto_fetch_columns = false;
    let data: DataType | null = null;

    async function MakeIndexAndSaveFile() {
        const args = {
            filename: $training_file.filename,
            filetype: $training_file.filetype,
            key: $training_file.key,
            use_dask: $use_dask,
            index_column_name: $training_column_name_index,
        };
        const pyfile = 'load_file.make_index_and_save_file';
        return { pyfile, args };
    }

    $: $index_column_valid = $loaded_df_columns?.includes($training_column_name_index) ?? false;
    $: if ($training_file['filename']) {
        $use_filtered_data_for_training = false;
        $filtered_dir = 'default';
        $training_column_name_X = 'SMILES';
        $training_column_name_y = '';
        data = null;
    }

    const on_training_file_load = async (e: CustomEvent) => {
        if (!e.detail) return;
        data = e.detail;
        if (!data) return;

        $loaded_df_columns = data.columns || [];

        if (!$loaded_df_columns.includes($training_column_name_X)) $training_column_name_X = '';
        if (!$loaded_df_columns.includes($training_column_name_y)) $training_column_name_y = '';

        auto_fetch_columns = true;
        if (!(await fs.exists($training_save_directory))) {
            await fs.mkdir($training_save_directory);
            console.log(`Directory created: ${$training_save_directory}`);
        }
    };

    const save_state = async () => {
        if (!(await fs.exists($training_file.filename))) return toast.error('Training file not found');
        // if (!(await fs.exists($training_save_directory))) return toast.error('Save directory not found');

        try {
            const file_state = {
                training_file: $training_file,
                training_column_name_X: $training_column_name_X,
                training_column_name_y: $training_column_name_y,
                training_column_name_index: $training_column_name_index,
                index_column_valid: $index_column_valid,
                training_save_directory: $training_save_directory,
                loaded_df_columns: $loaded_df_columns,
                auto_fetch_columns,
                use_filtered_data_for_training: $use_filtered_data_for_training,
                filtered_dir: $filtered_dir,
            };
            console.log(file_state, $training_save_directory);
            if (!(await fs.exists($training_save_directory))) {
                await fs.mkdir($training_save_directory);
                console.log(`Directory created: ${$training_save_directory}`);
            }

            await fs.writeTextFile(
                await path.join($training_save_directory, 'training_file_state.json'),
                JSON.stringify(file_state, null, 4),
            );
            toast.info('State saved');
        } catch (error) {
            console.error(error);
            toast.error('Error saving state');
        }
    };

    const load_state = async () => {
        try {
            if (!(await fs.exists($training_file.filename))) return toast.error('Training file not found');
            const filename = await path.join($training_save_directory, 'training_file_state.json');
            const loaded_state = await readJSON<LoadedTrainingState>(filename);
            if (!loaded_state) throw new Error('Invalid state file. Please check the file content');
            // console.log(loaded_state);
            $training_column_name_X = loaded_state.training_column_name_X;
            $training_column_name_y = loaded_state.training_column_name_y;
            $training_column_name_index = loaded_state.training_column_name_index;
            $loaded_df_columns = loaded_state.loaded_df_columns;
            if ($loaded_df_columns.length > 0) {
                auto_fetch_columns = true;
            }

            $use_filtered_data_for_training = loaded_state.use_filtered_data_for_training;
            $filtered_dir = loaded_state.filtered_dir;
            toast.success('State loaded');
        } catch (error) {
            toast.error(error);
        }
    };

    const reset_state = () => {
        $training_column_name_y = '';
        $loaded_df_columns = [];
        auto_fetch_columns = false;
        $use_filtered_data_for_training = false;
    };

    const auto_load_state = async () => {
        reset_state();
        $training_state_loaded = false;
        if (!(await fs.exists($training_file.filename))) return;
        if (!(await fs.exists(`${$training_save_directory}/training_file_state.json`))) return;
        await load_state();
        $training_state_loaded = true;
    };

    $: if ($training_file.filename) auto_load_state();
</script>

<FileLoader
    bind:use_dask={$use_dask}
    bind:filename={$training_file['filename']}
    bind:filetype={$training_file['filetype']}
    bind:key={$training_file['key']}
    on:load={on_training_file_load}
>
    <svelte:fragment slot="btn-row">
        <div class="ml-auto">
            <button class="btn btn-sm btn-outline" on:click={save_state}>Save state <Save size="20" /></button>
            <button class="btn btn-sm btn-outline" on:click={load_state}>Load state <Download size="20" /></button>
        </div>
    </svelte:fragment>
    <svelte:fragment let:load_btn>
        {#await fs.exists($training_file.filename) then file_exists}
            {#if file_exists}
                <Accordion>
                    <CustomPanel title="Configure">
                        <div class="grid gap-2">
                            <div class="flex flex-col gap-1">
                                <Checkbox bind:value={auto_fetch_columns} label="Auto-fetch column name" />
                                {#if auto_fetch_columns && !$loaded_df_columns.length}
                                    <span class="text-sm">Load file first!</span>
                                {/if}
                            </div>

                            <div class="flex items-end gap-1">
                                <CustomSelect
                                    enable_use_input
                                    use_input={!auto_fetch_columns}
                                    label="column X"
                                    bind:value={$training_column_name_X}
                                    items={$loaded_df_columns}
                                />
                                <CustomSelect
                                    enable_use_input
                                    use_input={!auto_fetch_columns}
                                    label="column Y"
                                    bind:value={$training_column_name_y}
                                    items={$loaded_df_columns}
                                />
                                <CustomInput
                                    label="npartitions disk"
                                    bind:value={$NPARTITIONS}
                                    type="number"
                                    placeholder="Enter dask npartitions"
                                />
                            </div>

                            <div class="flex items-end gap-1">
                                <CustomInput label="Enter INDEX column name" bind:value={$training_column_name_index} />
                                <Loadingbtn
                                    name="Make INDEX and save file"
                                    callback={MakeIndexAndSaveFile}
                                    on:result={e => {
                                        console.log(e.detail);
                                        load_btn?.click();
                                    }}
                                />
                                <span class="text-sm my-2">OR</span>
                                <CustomSelect
                                    label="Choose INDEX column"
                                    bind:value={$training_column_name_index}
                                    items={$loaded_df_columns || []}
                                />
                                <span class="badge badge-info ml-auto" class:badge-error={!$index_column_valid}>
                                    {$index_column_valid ? 'Index available' : 'Index not available'}
                                </span>
                            </div>
                            <FetchAnalysisDir />
                        </div>
                    </CustomPanel>
                    <CustomPanel title="Loaded fileinfos">
                        <LoadedFileInfos />
                    </CustomPanel>
                </Accordion>
            {/if}
        {/await}
    </svelte:fragment>
</FileLoader>
