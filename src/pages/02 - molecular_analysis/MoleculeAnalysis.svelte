<script lang="ts">
    import CustomInput from '$lib/components/CustomInput.svelte';
    import Loadingbtn from '$lib/components/Loadingbtn.svelte';
    import Molecule from '$lib/components/Molecule.svelte';
    import Chip, { Set, Text } from '@smui/chips';
    import PropertiesBox from './PropertiesBox.svelte';

    let smiles = 'C1=CC2C3C1C23';

    const all_properties = [
        'basic_properties',
        'ring_information',
        'chain_information',
        'aromaticity',
        'functional_groups',
        'physicochemical_properties',
        'heterocyclicity',
    ];
    let selected_properties: string[] = ['basic_properties', 'ring_information', 'chain_information'];

    let full_analysis: Record<string, any> = {};

    const compute_molecular_analysis = async () => {
        if (!smiles) return toast.error('Please provide a SMILES string');
        // console.log('Analyse', smiles);
        return {
            pyfile: 'molecule_analysis.generate_analysis',
            args: {
                smiles,
            },
        };
    };

    const onResult = (e: CustomEvent) => {
        if (!e.detail) return;
        const { dataFromPython } = e.detail;
        full_analysis = dataFromPython.full_analysis;
    };

    let optimized_pdb = '';
    let optimize_btn: HTMLButtonElement | undefined = undefined;
    let optimized = false;

    const optimize_3d_structure = async () => {
        if (!smiles) return toast.error('Please provide a SMILES string');
        return {
            pyfile: 'molecule_analysis.optimize_3d_structure',
            args: { smiles },
        };
    };

    const on_optimize_result = (e: CustomEvent) => {
        if (!e.detail) return;
        const { dataFromPython } = e.detail;
        optimized_pdb = dataFromPython.optimized_pdb;
        optimized = true;
    };

    let compute_btn: HTMLButtonElement | undefined = undefined;
</script>

<div class="grid gap-2">
    <CustomInput
        label="SMILES"
        bind:value={smiles}
        on:change={() => {
            if (!smiles) return;
            optimized = false;
            compute_btn?.click();
            optimize_btn?.click();
        }}
    />
    <Molecule bind:smiles {optimized_pdb} />
</div>

<div class="divider"></div>
<div class="m-auto">
    <Loadingbtn bind:btn={compute_btn} name="Analyse" callback={compute_molecular_analysis} on:result={onResult} />
    <Loadingbtn
        bind:btn={optimize_btn}
        name="Optimize"
        callback={optimize_3d_structure}
        on:result={on_optimize_result}
    />
</div>
<div class="divider"></div>

<Set chips={all_properties} let:chip filter bind:selected={selected_properties}>
    <Chip {chip} touch>
        <Text>{chip}</Text>
    </Chip>
</Set>

<div class="divider"></div>
{#if !isEmpty(full_analysis)}
    <PropertiesBox {selected_properties} {full_analysis} {all_properties} />
{:else}
    <div class="text-center">No data to display</div>
{/if}
