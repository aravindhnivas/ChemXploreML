<script lang="ts">
    import { RotateCcw } from 'lucide-svelte/icons';
    import { Stage } from 'ngl';
    import Loadingbtn from './Loadingbtn.svelte';

    export let smiles = '';
    export let width = 700;
    export let height = 400;

    let stage: Stage | null = null;
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

        try {
            let component;
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

    let reset_structure = false;
    let optimized_pdb = '';
    let optimize_btn: HTMLButtonElement | undefined = undefined;

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
    };
</script>

<div class="flex">
    <button
        class="btn btn-sm btn-outline"
        on:click={() => {
            if (!optimized_pdb) optimize_btn?.click();
            reset_structure = !reset_structure;
        }}
    >
        <span>Structure</span>
        <RotateCcw size="20" />
    </button>
</div>

{#key reset_structure}
    <div style="cursor: pointer;" use:init_ngl></div>
{/key}

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
    />
</div>
