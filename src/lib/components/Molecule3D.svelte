<script lang="ts">
    import { RotateCcw, Settings } from 'lucide-svelte/icons';
    import { Stage } from 'ngl';
    import Loadingbtn from './Loadingbtn.svelte';
    import type { Component } from 'ngl';
    import Modal from './modal/Modal.svelte';
    import CustomInput from './CustomInput.svelte';
    import CustomSelect from './CustomSelect.svelte';

    export let smiles = '';
    export let width = 700;
    export let height = 400;

    let stage: Stage | null = null;
    let component: Component | void;

    const init_ngl = (node: HTMLDivElement) => {
        console.log('Initializing NGL Stage...');
        if (stage) {
            stage.dispose();
            stage = null;
        }
        stage = new Stage(node, {
            backgroundColor: 'white',
            tooltip: false,
        });
    };

    const load_3d_structure = async (smiles: string, optimized_pdb: string = '') => {
        if (!window.RDKit) return toast.error('RDKit not loaded.');
        if (!stage) {
            toast.error('NGL Stage not initialized.');
            return;
        }
        if (!smiles) return toast.error('No SMILES provided.');
        const mol = window.RDKit.get_mol(smiles);
        if (!mol) return toast.error('Failed to get molecule.');

        stage.removeAllComponents();
        component?.removeAllRepresentations();

        try {
            if (optimized_pdb) {
                console.warn('Loading optimized PDB...');
                console.log({ optimized_pdb });
                component = await stage.loadFile(new Blob([optimized_pdb], { type: 'chemical/x-pdb' }), { ext: 'pdb' });
            } else {
                console.warn('Loading original MOL...', { optimized_pdb });
                const mol_block = mol.get_v3Kmolblock();
                component = await stage.loadFile(new Blob([mol_block], { type: 'chemical/x-mol' }), { ext: 'mol' });
            }

            if (!component) {
                toast.error('Failed to load component.');
                return;
            }

            console.log('Structure loaded. Applying representation and centering...');
            component.addRepresentation('ball+stick', {});
            stage.handleResize();

            component.autoView();
            component.setScale(1.5); // Adjust scale as needed
            component.setVisibility(true); // Ensure visibility

            console.log(`Successfully loaded and centered structure for ${smiles}.`);
        } catch (error) {
            toast.error('Failed to load structure. ' + error);
            stage.removeAllComponents();
        }
    };

    function debounce(func: Function, wait: number) {
        let timeout: number | undefined;
        return function executedFunction(...args: any[]) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = window.setTimeout(later, wait);
        };
    }

    const handleResize = debounce(() => {
        if (stage) {
            console.log('Handling resize...');
            stage.handleResize();
            const comp = stage.compList[0];
            if (comp) {
                comp.autoView(100); // Re-center smoothly
            }
        }
    }, 250); // Debounce resize calls by 250ms

    onMount(async () => {
        window.addEventListener('resize', handleResize);
    });

    onDestroy(() => {
        console.log('Destroying NGL Stage and removing listeners...');
        if (stage) {
            stage.dispose();
            stage = null;
        }
        window.removeEventListener('resize', handleResize);
    });

    $: stage && load_3d_structure(smiles, optimized_pdb);
    $: stage?.setSize(`${width}px`, `${height}px`);
    $: smiles && optimize_btn?.click();

    let optimized_pdb = '';
    let optimize_btn: HTMLButtonElement | undefined = undefined;

    const optimize_3d_structure = async () => {
        if (!smiles) return toast.error('Please provide a SMILES string');
        const config = {
            max_attempts: Number(max_attempts),
            random_seed: Number(random_seed),
            optimization_steps: Number(optimization_steps),
            energy_threshold: Number(energy_threshold),
            force_field,
        };

        return {
            pyfile: 'molecule_analysis.optimize_3d_structure',
            args: { smiles, config },
        };
    };

    const on_optimize_result = (e: CustomEvent) => {
        if (!e.detail) return;
        const { dataFromPython } = e.detail;
        optimized_pdb = dataFromPython.optimized_pdb;
    };

    let settings_modal_open = false;
    let max_attempts = 10;
    let random_seed = 42;
    let force_field: 'MMFF94s' | 'MMFF94' | 'UFF' = 'MMFF94s';
    let optimization_steps = 1000;
    let energy_threshold = 1e-4;

    const save_settings = () => {
        console.log({ max_attempts, random_seed, force_field, optimization_steps, energy_threshold });

        localStorage.setItem(
            'molecule_3d_optimize_settings',
            JSON.stringify({ max_attempts, random_seed, force_field, optimization_steps, energy_threshold }),
        );
    };

    const reset_settings = () => {
        max_attempts = 10;
        random_seed = 42;
        force_field = 'MMFF94s';
        optimization_steps = 1000;
        energy_threshold = 1e-4;
    };

    onMount(() => {
        const settings = localStorage.getItem('molecule_3d_optimize_settings');
        if (settings) {
            const parsed_settings = JSON.parse(settings);
            max_attempts = parsed_settings.max_attempts;
            random_seed = parsed_settings.random_seed;
            force_field = parsed_settings.force_field;
            optimization_steps = parsed_settings.optimization_steps;
            energy_threshold = parsed_settings.energy_threshold;
        }
    });
</script>

<div class="flex">
    <button
        class="btn btn-sm btn-outline"
        on:click={() => {
            optimized_pdb = '';
            optimize_btn?.click();
        }}
    >
        <span>Structure</span>
        <RotateCcw size="20" />
    </button>
</div>

<div style="cursor: pointer;" use:init_ngl></div>

<div class="flex-gap">
    {#if optimized_pdb}
        <span class="badge badge-sm badge-success">Optimized</span>
    {:else}
        <span class="badge badge-sm badge-error">Not Optimized</span>
    {/if}

    <Loadingbtn
        bind:btn={optimize_btn}
        name="Optimize-3D"
        callback={optimize_3d_structure}
        on:result={on_optimize_result}
    >
        <svelte:fragment slot="button-slot">
            <button class="btn btn-sm btn-outline join-item" on:click={() => (settings_modal_open = true)}>
                <Settings size="20" />
            </button>
        </svelte:fragment>
    </Loadingbtn>

    <Modal title="Optimize parameters" bind:open={settings_modal_open} show_button={false} let:closeModal>
        <div class="grid grid-cols-2 gap-2">
            <CustomInput label="Max Attempts" bind:value={max_attempts} />
            <CustomInput label="Random Seed" bind:value={random_seed} />
            <CustomInput label="Optimization Steps" bind:value={optimization_steps} />
            <CustomInput label="Energy Threshold" bind:value={energy_threshold} />
            <CustomSelect label="Force Field" bind:value={force_field} items={['MMFF94s', 'MMFF94', 'UFF']} />
        </div>

        <div class="flex justify-end gap-2">
            <button class="btn btn-sm btn-error" on:click={reset_settings}>Reset</button>
            <button
                class="btn btn-sm btn-primary"
                on:click={() => {
                    save_settings();
                    closeModal();
                    optimize_btn?.click();
                }}
            >
                Save
            </button>
        </div>
    </Modal>
</div>
