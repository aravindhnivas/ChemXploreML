<script lang="ts">
    import { RotateCcw } from 'lucide-svelte/icons';
    import { Stage } from 'ngl';

    export let smiles = '';
    export let width = 700;
    export let height = 400;
    export let optimized_pdb = '';

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
        // load_3d_structure(smiles);
    };

    const load_3d_structure = async (smiles: string, optimized_pdb: string = '') => {
        if (!window.RDKit) return toast.error('RDKit not loaded.');
        if (!stage) {
            toast.error('NGL Stage not initialized.');
            return;
        }
        if (!smiles) return;
        // console.warn('Loading structure...');
        const mol = window.RDKit.get_mol(smiles);
        if (!mol) return;

        // mol.add_hs();
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

            // const mol_block = mol.get_v3Kmolblock();
            // const component = await stage.loadFile(new Blob([mol_block], { type: 'chemical/x-mol' }), { ext: 'mol' });

            if (!component) {
                toast.error('Failed to load component.');
                return;
            }

            console.log('Structure loaded. Applying representation and centering...');
            component.addRepresentation('ball+stick', {
                // Optional: Customize representation settings here
                // color: 'element',
                // radiusScale: 1.5
            });
            // component.removeAllRepresentations();

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

    // Debounce function to limit resize calls
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

    // Handle viewport resize
    const handleResize = debounce(() => {
        if (stage) {
            console.log('Handling resize...');
            stage.handleResize();
            // Optional: Recenter the first component if it exists
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

    $: if (stage) {
        load_3d_structure(smiles, optimized_pdb);
        stage.setSize(`${width}px`, `${height}px`);
    }

    let reset_structure = false;
</script>

<div class="flex">
    <button
        class="btn btn-sm btn-outline"
        on:click={() => {
            reset_structure = !reset_structure;
            optimized_pdb = '';
        }}
    >
        <span>Structure</span>
        <RotateCcw size="20" />
    </button>
</div>
{#key reset_structure}
    <div use:init_ngl></div>
{/key}
