<script lang="ts">
    import { dr_methods, active_dr, use_dr } from './stores';
    import Radio from '@smui/radio';

    import {
        current_embedder_model_filepath,
        embedd_savefile,
        embedd_savefile_path,
    } from '$pages/04 - embedd_molecule/stores';
    import Checkbox from '$lib/components/Checkbox.svelte';
    import CustomInput from '$lib/components/CustomInput.svelte';
</script>

<Checkbox bind:value={$use_dr} label="use DR" />

<!-- {#if $use_dr} -->
<div class="flex">
    {#each dr_methods as option}
        <div class="flex items-center">
            <Radio bind:group={$active_dr} value={option} touch />
            <pre>{option}</pre>
        </div>
    {/each}
</div>

<div class="flex-gap">
    <CustomInput value={$embedd_savefile} disabled />
    _
    <CustomInput value="" />
</div>
<!-- {/if} -->

<div class="grid gap-1 w-full grid-cols-4 items-center">
    <div class="divider col-span-4"></div>

    <div class="text-sm">Choosen DR</div>
    <pre class="text-sm col-span-3">{$active_dr}</pre>
    <div class="divider col-span-4"></div>

    <div class="text-sm">Molecular Embedder - Modal</div>
    <pre class="text-sm col-span-3">{$current_embedder_model_filepath}</pre>
    <div class="divider col-span-4"></div>

    <div class="text-sm">Vectorized file</div>
    {#await $embedd_savefile_path then value}
        <pre class="text-sm col-span-3 break-all whitespace-normal">{value}</pre>
    {/await}
    <div class="divider col-span-4"></div>
</div>
