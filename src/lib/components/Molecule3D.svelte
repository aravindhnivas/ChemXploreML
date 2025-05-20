<script lang="ts">
    import { RotateCcw } from 'lucide-svelte/icons';
    import { Stage } from 'ngl';

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

        load_3d_structure(smiles);
    };

    const load_3d_structure = async (smiles: string) => {
        if (!window.RDKit) return toast.error('RDKit not loaded.');
        if (!stage) {
            toast.error('NGL Stage not initialized.');
            return;
        }

        if (!smiles) return;

        const mol = window.RDKit.get_mol(smiles);
        if (!mol) return;

        stage.removeAllComponents();

        try {
            const mol_block = mol.get_v3Kmolblock();
            const component = await stage.loadFile(new Blob([mol_block], { type: 'chemical/x-mol' }), { ext: 'mol' });
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
            toast.error('Failed to load structure.');
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
        if (window.RDKit) load_3d_structure(smiles);
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
        load_3d_structure(smiles);
        stage.setSize(`${width}px`, `${height}px`);
    }

    let reset_structure = false;
</script>

<div class="flex">
    <button class="btn btn-sm btn-outline" on:click={() => (reset_structure = !reset_structure)}>
        <span>Structure</span>
        <RotateCcw size="20" />
    </button>
</div>
{#key reset_structure}
    <div use:init_ngl></div>
{/key}
