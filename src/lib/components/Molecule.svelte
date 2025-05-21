<script lang="ts">
    import { afterUpdate } from 'svelte';
    import SmilesDrawer from 'smiles-drawer';
    import { Proportions, Box } from 'lucide-svelte/icons';
    import Molecule3D from './Molecule3D.svelte';
    import CustomInput from './CustomInput.svelte';

    export let smiles = '';
    export let width = 700;
    export let height = 400;
    export let show_controls = true;
    export let show_3d = true;

    const MIN_WIDTH = 500;
    const MAX_WIDTH = 1000;
    const DEFAULT_WIDTH = 700;
    const STEP_WIDTH = 10;

    const MIN_HEIGHT = 300;
    const MAX_HEIGHT = 1000;
    const DEFAULT_HEIGHT = 400;
    const STEP_HEIGHT = 10;

    const on_dimension_change = (e: Event, type: 'width' | 'height') => {
        const value = (e.target as HTMLInputElement).value;
        const min = type === 'width' ? MIN_WIDTH : MIN_HEIGHT;
        const max = type === 'width' ? MAX_WIDTH : MAX_HEIGHT;
        const def = type === 'width' ? DEFAULT_WIDTH : DEFAULT_HEIGHT;

        if (!value) return type === 'width' ? (width = def) : (height = def);
        const number = Number(value);
        if (isNaN(number)) return type === 'width' ? (width = def) : (height = def);
        if (number < min) return type === 'width' ? (width = min) : (height = min);
        if (number > max) return type === 'width' ? (width = max) : (height = max);
        type === 'width' ? (width = number) : (height = number);
    };

    $: drawer = new SmilesDrawer.SvgDrawer({ width, height });
    let svgElement: SVGElement;

    afterUpdate(() => {
        if (show_3d) return;
        if (!smiles || !drawer) return;
        SmilesDrawer.parse(smiles, function (tree: any) {
            drawer.draw(tree, svgElement, 'light');
        });
    });
</script>

<div class="grid gap-2">
    <div class="flex gap-2">
        <button
            class="btn btn-sm"
            class:btn-outline={!show_controls}
            class:btn-primary={show_controls}
            on:click={() => (show_controls = !show_controls)}
        >
            <span>Controller</span>
            <Proportions size="20" />
        </button>
        <button
            class="btn btn-sm"
            class:btn-outline={!show_3d}
            class:btn-primary={show_3d}
            on:click={() => (show_3d = !show_3d)}
        >
            <span>3D</span>
            <Box size="20" />
        </button>
    </div>

    {#if show_controls}
        <div class="grid grid-cols-5 gap-2 items-end w-max">
            <div class="col-span-2 grid gap-1">
                <span class="text-sm">Width: {width}px</span>
                <CustomInput
                    value={width}
                    type="number"
                    min={MIN_WIDTH}
                    max={MAX_WIDTH}
                    step={STEP_WIDTH}
                    on:change={e => on_dimension_change(e, 'width')}
                />
            </div>
            <div class="grid gap-1 col-span-2">
                <span class="text-sm">Height: {height}px</span>
                <CustomInput
                    value={height}
                    type="number"
                    min={MIN_HEIGHT}
                    max={MAX_HEIGHT}
                    step={STEP_HEIGHT}
                    on:change={e => on_dimension_change(e, 'height')}
                />
            </div>
            <button
                class="btn btn-sm btn-outline"
                on:click={() => {
                    width = 700;
                    height = 400;
                }}
            >
                Restore
            </button>
        </div>
    {/if}

    {#if show_3d}
        <Molecule3D bind:smiles bind:width bind:height />
    {:else}
        <div class="flex-center rounded-1">
            <svg
                style:width
                style:height
                style="background-color: antiquewhite;"
                bind:this={svgElement}
                data-smiles={smiles}
            />
        </div>
    {/if}
</div>
