<script lang="ts">
    import {
        atoms_bin_size,
        filtered_dir,
        structuralDistributionFilter,
        elementalDistributionFilter,
        sizeDistributionFilter,
        current_analysis_file,
        YDistributionFilter,
        current_training_data_file,
    } from './plot-analysis/stores';
    import { training_column_name_X, training_file, index_column_valid, training_column_name_index } from './stores';
    import Loadingbtn from '$lib/components/Loadingbtn.svelte';
    import { use_dask } from '$lib/stores/system';
    import PlotAnalysis from './plot-analysis/PlotAnalysis.svelte';
    import Notification from '$lib/components/Notification.svelte';
    import FetchAnalysisDir from './FetchAnalysisDir.svelte';

    const MolecularAnalysis = async (
        mode: 'all' | 'size_distribution' | 'structural_distribution' | 'elemental_distribution' = 'all',
        force: boolean = false,
    ) => {
        const analysis_file = await $current_analysis_file;
        return {
            pyfile: 'load_file.molecular_analysis',
            args: {
                filename: await $current_training_data_file,
                filetype: $training_file.filetype,
                key: $training_file.key,
                use_dask: $use_dask,
                smiles_column_name: $training_column_name_X,
                analysis_file: analysis_file,
                atoms_bin_size: Number($atoms_bin_size),
                mode,
                index_column_name: $training_column_name_index,
                force,
            },
        };
    };

    let duplicates: number = 0;
    let deduplicated_filename = '';

    const onRemoveDuplicatesOnXColumn = (e: CustomEvent) => {
        const { dataFromPython } = e.detail as {
            dataFromPython: {
                deduplicated_filename: string;
                duplicates: number;
            };
        };
        if (!dataFromPython) return;
        duplicates = dataFromPython.duplicates;
        if (dataFromPython.duplicates > 0) {
            deduplicated_filename = dataFromPython.deduplicated_filename;
            toast.success(
                `${dataFromPython.duplicates} duplicates removed. Filename: ${dataFromPython.deduplicated_filename}`,
            );
        } else {
            toast.warning('No duplicates found');
            deduplicated_filename = '';
            duplicates = 0;
        }
    };

    const ApplyFilterForMolecularAnalysis = async (filtered_filename: string) => {
        if ($filtered_dir !== 'default') {
            toast.error('Filters can only be applied to the default directory');
            return;
        }
        const analysis_file = await $current_analysis_file;
        const analysis_file_exists = await fs.exists(analysis_file);
        if (!analysis_file_exists) {
            toast.error(`${analysis_file} file does not exist`);
            return;
        }

        console.warn({
            $structuralDistributionFilter,
            $elementalDistributionFilter,
            $sizeDistributionFilter,
            $YDistributionFilter,
        });

        let min_atomic_number = null;
        if (!$sizeDistributionFilter.min_atomic_number.lock) {
            min_atomic_number = Number($sizeDistributionFilter.min_atomic_number.value);
        }

        let max_atomic_number = null;
        if (!$sizeDistributionFilter.max_atomic_number.lock) {
            max_atomic_number = Number($sizeDistributionFilter.max_atomic_number.value);
        }

        let size_count_threshold = null;
        if (!$sizeDistributionFilter.count_threshold.lock) {
            size_count_threshold = Number($sizeDistributionFilter.count_threshold.value);
        }

        let elemental_count_threshold = null;
        if (!$elementalDistributionFilter.count_threshold.lock) {
            elemental_count_threshold = Number($elementalDistributionFilter.count_threshold.value);
        }

        const filter_elements = $elementalDistributionFilter.filter_elements;
        const filter_structures = $structuralDistributionFilter.filter_structures;

        const args = {
            analysis_file,
            min_atomic_number,
            max_atomic_number,
            size_count_threshold,
            elemental_count_threshold,
            filter_elements: filter_elements.filter(Boolean),
            filter_structures: filter_structures.filter(Boolean),
            filtered_filename,
            index_column_name: $training_column_name_index,
        };
        const pyfile = 'load_file.apply_filter_for_molecular_analysis';
        return { pyfile, args };
    };

    const CheckDuplicatesOnXColumn = async () => {
        duplicates = 0;
        deduplicated_filename = '';
        const args = {
            filename: $training_file.filename,
            filetype: $training_file.filetype,
            key: $training_file.key,
            use_dask: $use_dask,
            smiles_column_name: $training_column_name_X,
            index_column_name: $training_column_name_index,
        };
        const pyfile = 'load_file.check_duplicates_on_x_column';
        return { pyfile, args };
    };

    setContext('MolecularAnalysis', MolecularAnalysis);
    setContext('ApplyFilterForMolecularAnalysis', ApplyFilterForMolecularAnalysis);
</script>

{#if $index_column_valid}
    <div class="grid gap-2">
        <FetchAnalysisDir />
        <div class="flex gap-2 m-auto items-end">
            <Loadingbtn
                name="Remove duplicates on X column"
                subprocess={true}
                callback={() => CheckDuplicatesOnXColumn()}
                on:result={onRemoveDuplicatesOnXColumn}
            />
        </div>
    </div>

    {#if duplicates > 0}
        <Notification
            message="{duplicates} duplicates found! load the fixed file for further analysis. View more for details"
            type="warning"
        >
            <svelte:fragment slot="more_details">
                <div class="grid gap-2">
                    <span>{duplicates} duplicates found and removed</span>
                    <span
                        >Fixed file saved as: {deduplicated_filename}. Browse and load this file for further analysis.</span
                    >
                </div>
            </svelte:fragment>
        </Notification>
    {/if}
    <div class="divider"></div>
    <PlotAnalysis />
{:else}
    <div class="badge badge-error">Make sure INDEX column is valid and available in the training file</div>
{/if}
