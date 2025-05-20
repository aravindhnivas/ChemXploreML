<script lang="ts">
    import { afterUpdate } from 'svelte';
    import SmilesDrawer from 'smiles-drawer';
    import { Proportions, Box } from 'lucide-svelte/icons';
    import Molecule3D from './Molecule3D.svelte';

    export let smiles = '';
    export let width = 700;
    export let height = 400;
    export let show_controls = false;
    export let show_3d = true;

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
        <div class="grid grid-cols-5 gap-2">
            <div class="col-span-2 grid gap-1">
                <span class="text-sm">Width: {width}px</span>
                <input class="range range-xs" type="range" bind:value={width} min="100" max="1000" step="10" />
            </div>
            <div class="grid gap-1 col-span-2">
                <span class="text-sm">Height: {height}px</span>
                <input class="range range-xs" type="range" bind:value={height} min="100" max="1000" step="10" />
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
