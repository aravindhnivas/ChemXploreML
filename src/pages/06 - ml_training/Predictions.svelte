<script lang="ts">
    import BrowseFile from '$lib/components/BrowseFile.svelte';
    import Loadingbtn from '$lib/components/Loadingbtn.svelte';
    import Molecule from '$lib/components/Molecule.svelte';
    import CustomInput from '$lib/components/CustomInput.svelte';
    import { Checkbox, CustomSelect } from '$lib/components';
    import {
        current_training_data_file,
        current_training_processed_data_directory,
    } from '$pages/03 - load_file/plot-analysis/stores';
    import { embedder_model_filepath } from '$pages/04 - embedd_molecule/stores';
    import { HelpCircle, RefreshCcw } from 'lucide-svelte/icons';
    import { find, uniqBy } from 'lodash-es';
    import PredictionTable from './PredictionTable.svelte';

    const predict = async () => {
        if (!(await fs.exists($pretrained_model_file))) {
            toast.error('pretrained_model file not found');
            return;
        }

        if (test_mode && !$smiles) {
            toast.error('Enter molecular SMILES');
            return;
        }

        if (!test_mode && !(await fs.exists($prediction_file))) {
            toast.error('Please select a test file');
            return;
        }

        let embedder_loc: string = '';
        const embedder = $choosen_embedder.split('_with')[0] as Embedding;
        console.log({ embedder });
        embedder_loc = $embedder_model_filepath[embedder];
        if (!embedder_loc) {
            console.log({ $embedder_model_filepath, $choosen_embedder, embedder, embedder_loc });
            return toast.error('Invalid embedder location');
        }

        if (test_mode) predicted_value = 'Computing...';
        const args = {
            smiles: $smiles,
            pretrained_model_file: $pretrained_model_file,
            prediction_file: test_mode ? null : $prediction_file,
            embedder_name: embedder,
            embedder_loc,
            choosen_model: $choosen_model,
            choosen_embedder: $choosen_embedder,
            choosen_pkl_key: $choosen_pkl_key,
        };
        const pyfile = 'ml_training.ml_prediction';
        return { pyfile, args };
    };

    const onResult = (e: CustomEvent) => {
        const { dataFromPython } = e.detail;
        console.log(dataFromPython);
        if (!test_mode) {
            if (!dataFromPython.savedfile) {
                toast.error('Error in prediction, check logs');
                return;
            }
            toast.success('Prediction completed, file saved' + dataFromPython.savedfile);
            return;
        }

        if (!dataFromPython) {
            predicted_value = 'Error';
        } else {
            predicted_value = dataFromPython.predicted_value;
            const table_data = [
                {
                    id: getID(),
                    smiles: dataFromPython.smiles,
                    model: dataFromPython.choosen_model,
                    embedder: dataFromPython.choosen_embedder,
                    pre_trained_model: dataFromPython.choosen_pkl_key,
                    prediction: dataFromPython.predicted_value,
                },
                ...prediction_table_data,
            ];

            const uniq_table_data = uniqBy(
                table_data,
                item => `${item.smiles}-${item.model}-${item.embedder}-${item.pre_trained_model}`,
            );
            prediction_table_data = uniq_table_data;
        }
    };

    const pretrained_model_file = localWritable('ml_prediction_pretrained_model_file', '');
    let test_mode = true;
    const prediction_file = localWritable('ml_prediction_file', '');

    const smiles = localWritable(
        'ml_prediction_molecular_smiles',
        'COP(=S)(OC)OC1=CC=C(C=C1)SC2=CC=C(C=C2)OP(=S)(OC)OC',
    );

    let predicted_value: number | string = '';
    let predicted_value_significance = 2;

    $: if (predicted_value_significance < 0) predicted_value_significance = 0;
    $: if (predicted_value_significance > 10) predicted_value_significance = 10;

    const width = localWritable('ml_prediction_molecular_svg_width', 500);
    const height = localWritable('ml_prediction_molecular_svg_height', 400);

    // let result_names = {} as Record<string, Record<string, { pkl: string; childrens: Record<string, any> }>>;

    const fetch_all_pkl_files = async (dir: string) => {
        if (!(await fs.exists(dir))) return [];
        const result_names = {} as Record<string, Record<string, { pkl: string; childrens: Record<string, any> }>>;
        const fname = await path.basename(dir);
        result_names[fname] = {};

        const getAllPklFiles = async (
            directory: string,
            parentName = '',
        ): Promise<Array<{ name: string; pkl_file: string }>> => {
            console.log('Fetching all pkl files from directory');
            console.log(directory);
            const files = await fs.readDir(directory);
            const results: Array<{ name: string; pkl_file: string }> = [];

            // Helper function to process a directory and find pkl files
            const processDirForPkl = async (dirPath: string, dirName: string) => {
                const contents = await fs.readDir(dirPath);

                if (!contents.some(f => f.name.endsWith('.results.json'))) return null;

                const datFile = contents.find(f => f.name.endsWith('.dat.json'))?.name;
                if (!datFile) return null;

                const pklFile = datFile.replace('.dat.json', '.pkl');
                return {
                    name: parentName ? `${parentName}: ${dirName}` : dirName,
                    pkl_file: await path.join(dirPath, pklFile),
                };
            };

            const searchSubdir = async (dirPath: string, name: string) => {
                let results = [] as Array<{ name: string; pkl_file: string }>;
                if (!(await fs.exists(dirPath))) return results;
                const subdirs = (await fs.readDir(dirPath)).filter(f => f.isDirectory);

                // Initialize the parent structure if it doesn't exist
                if (!result_names[fname][name]) {
                    result_names[fname][name] = { pkl: '', childrens: {} };
                }

                for (const subdir of subdirs) {
                    const subdirPath = await path.join(dirPath, subdir.name);
                    const subdirResult = await processDirForPkl(subdirPath, subdir.name);
                    if (subdirResult) {
                        results.push({
                            ...subdirResult,
                            name: `${name}: ${subdir.name}`,
                        });

                        // Initialize subdir structure
                        result_names[fname][name].childrens[subdir.name] = {
                            pkl: subdirResult.pkl_file,
                            childrens: {},
                        };
                    }
                    const subsubdirs = (await fs.readDir(subdirPath)).filter(f => f.isDirectory);
                    for (const subsubdir of subsubdirs) {
                        const subsubdirPath = await path.join(subdirPath, subsubdir.name);
                        const subsubdirResult = await processDirForPkl(subsubdirPath, subsubdir.name);
                        if (subsubdirResult) {
                            results.push({
                                ...subsubdirResult,
                                name: `${name}: ${subdir.name}: ${subsubdir.name}`,
                            });

                            // Safely access and update nested structure
                            const parentChild = result_names[fname][name].childrens[subdir.name];
                            if (parentChild) {
                                parentChild.childrens[subsubdir.name] = {
                                    pkl: subsubdirResult.pkl_file,
                                    childrens: {},
                                };
                            }
                        }
                    }
                }
                return results;
            };

            // Process each directory
            for (const entry of files.filter(f => f.isDirectory)) {
                const currentPath = await path.join(directory, entry.name);

                // Check main directory
                const mainDirResult = await processDirForPkl(currentPath, entry.name);
                if (mainDirResult) {
                    results.push(mainDirResult);

                    result_names[fname][entry.name] = {
                        ...result_names[fname][entry.name],
                        pkl: mainDirResult.pkl_file,
                        childrens: {},
                    };
                }

                // Check processed_subdirs if they exist
                const processedSubdirsPath = await path.join(currentPath, 'processed_subdirs');
                const subdir_results = await searchSubdir(processedSubdirsPath, entry.name);
                results.push(...subdir_results);
            }
            return results;
        };
        try {
            const pkl_files = await getAllPklFiles(dir);
            return pkl_files;
        } catch (error) {
            toast.error('Error fetching pkl files: ' + error);
            return [];
        }
    };

    let fetched_pkl_files = {} as Record<string, { name: string; pkl_file: string }[]>;

    const get_valid_dirs = async (name: Promise<string>, model: string) => {
        if (!model) return {};
        console.log(`Fetching all pkl files from ${model}`);
        const all_pkl_files = {} as Record<string, { name: string; pkl_file: string }[]>;
        $choosen_embedder = '';
        $choosen_pkl_key = '';
        $pretrained_model_file = '';
        const root_dir = await name;
        const model_dir = await path.join(root_dir, 'pretrained_models', model);
        if (!(await fs.exists(model_dir))) return {};

        for (const child of (await fs.readDir(model_dir)).filter(f => f.isDirectory)) {
            const embeddings_dir = await path.join(model_dir, child.name);
            const pkl_files = await fetch_all_pkl_files(embeddings_dir);
            all_pkl_files[child.name.replace('_embeddings', '')] = pkl_files;
        }
        fetched_pkl_files = structuredClone(all_pkl_files);
        return all_pkl_files;
    };

    const get_all_available_models = async (name: Promise<string>) => {
        const root_dir = await name;
        const model_dir = await path.join(root_dir, 'pretrained_models');
        const all_dirs = (await fs.readDir(model_dir)).filter(f => f.isDirectory).map(f => f.name);
        return all_dirs;
    };

    const choosen_model = writable('lgbm');
    const choosen_embedder = writable('mol2vec');
    const choosen_pkl_key = writable('default');

    $: if (!isEmpty(fetched_pkl_files) && $choosen_model && $choosen_embedder && $choosen_pkl_key) {
        $pretrained_model_file =
            find(fetched_pkl_files[$choosen_embedder], o => o.name === $choosen_pkl_key)?.pkl_file ?? '';
    }

    let refresh_state = false;
    let prediction_table_data = [] as {
        id: string;
        smiles: string;
        model: string;
        embedder: string;
        pre_trained_model: string;
        prediction: string;
    }[];
</script>

<div class="grid gap-2 mb-2">
    <div class="flex items-center gap-2 justify-between">
        <div class="flex-gap">
            {#await get_file_metadata($current_training_data_file) then value}
                <pre class="text-sm p-1 rounded-lg bg-base-100">{value?.basename}</pre>
                <span aria-label={value?.filename} data-cooltipz-dir="bottom" data-cooltipz-size="medium">
                    <HelpCircle size="20" />
                </span>
            {/await}
        </div>
        <Checkbox class="ml-auto" label="Test mode" bind:value={test_mode} />
    </div>
    <div class="divider"></div>

    <div class="flex-gap items-end">
        <button class="btn btn-sm btn-outline" on:click={() => (refresh_state = !refresh_state)}>
            <RefreshCcw size="20" />
        </button>
        {#key refresh_state}
            {#await get_all_available_models($current_training_processed_data_directory) then items}
                <CustomSelect bind:value={$choosen_model} {items} label="model" />
            {/await}

            {#await get_valid_dirs($current_training_processed_data_directory, $choosen_model) then all_pkl_files}
                <CustomSelect bind:value={$choosen_embedder} items={Object.keys(all_pkl_files)} label="embedder" />
                {#if $choosen_embedder}
                    <CustomSelect
                        bind:value={$choosen_pkl_key}
                        items={all_pkl_files[$choosen_embedder].map(f => f.name)}
                        label="pre-trained model"
                    />
                {/if}
            {/await}
        {/key}
    </div>

    <div class="divider"></div>

    <BrowseFile enable_lock lock bind:filename={$pretrained_model_file} label="pretrained_model_file" />

    {#if !test_mode}
        <BrowseFile
            bind:filename={$prediction_file}
            label="upload file to predict"
            filters={[{ name: 'SMILES files', extensions: ['smi', 'csv'] }]}
        />
    {/if}

    <div class="grid grid-cols-5 items-end gap-2">
        {#if test_mode}
            <CustomInput class="col-span-3" bind:value={$smiles} label="Enter molecular SMILES" />
        {/if}
        <Loadingbtn
            callback={predict}
            on:result={onResult}
            on:close={() => {
                if (predicted_value === 'Computing...') {
                    predicted_value = '';
                }
            }}
            subprocess={!test_mode}
        />
    </div>

    {#if test_mode}
        <div class="flex items-start gap-4">
            <Molecule bind:smiles={$smiles} bind:width={$width} bind:height={$height} />
            <CustomInput
                bind:value={predicted_value_significance}
                label="Significance"
                type="number"
                disabled={!isNumber(predicted_value)}
                min="0"
                max="10"
            />
            <div class="grid gap-2">
                <div class="text-sm">Predicted value</div>
                <div class="rounded-1 p-1" style="background-color: antiquewhite;">
                    <span class="select-text">
                        {isNumber(predicted_value)
                            ? predicted_value.toFixed(predicted_value_significance)
                            : predicted_value}
                    </span>
                </div>

                <PredictionTable bind:prediction_table_data />
            </div>
        </div>
    {/if}
</div>
