<script lang="ts">
    import CustomInput from '$lib/components/CustomInput.svelte';
    import Loadingbtn from '$lib/components/Loadingbtn.svelte';
    import Molecule from '$lib/components/Molecule.svelte';
    import Chip, { Set, Text } from '@smui/chips';
    import PropertiesBox from './PropertiesBox.svelte';
    import Accordion from '@smui-extra/accordion';
    import CustomPanel from '$lib/components/CustomPanel.svelte';

    let smiles = 'CCO';

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

    let compute_btn: HTMLButtonElement | undefined = undefined;
</script>

<Accordion>
    <div class="grid gap-2 mb-2">
        <CustomInput
            label="SMILES"
            bind:value={smiles}
            on:change={() => {
                if (!smiles) return;
                compute_btn?.click();
            }}
        />
    </div>
    <CustomPanel title="Molecular structure" open={true}>
        <Molecule bind:smiles />
    </CustomPanel>

    <CustomPanel title="Basic properties">
        <div class="m-auto">
            <Loadingbtn
                bind:btn={compute_btn}
                name="Analyse"
                callback={compute_molecular_analysis}
                on:result={onResult}
            />
        </div>

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
    </CustomPanel>
</Accordion>
