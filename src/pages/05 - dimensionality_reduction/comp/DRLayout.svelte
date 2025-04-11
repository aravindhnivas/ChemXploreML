<script lang="ts">
    import { CustomInput, CustomSelect, Loadingbtn } from '$lib/components';
    import { loaded_files } from '$lib/meta-componenets/stores';
    import SaveAndLoadState from '$lib/components/SaveAndLoadState.svelte';
    import {
        current_embedder_model_filepath,
        embedd_savefile_path,
        embedding,
        embeddings,
    } from '$pages/04 - embedd_molecule/stores';
    import { DR_default_params } from '../stores';

    export let loc: string;
    export let name: DRNames;
    export let params: Record<string, number | string> = {};

    const generate_reduced_embeddings = async () => {
        if (!$current_embedder_model_filepath) {
            toast.error('Please select a model_file');
            return;
        }

        const npy_file = await $embedd_savefile_path;
        if (!(await fs.exists(npy_file))) {
            toast.error('Please select a .npy vectors file');
            return;
        }

        return {
            pyfile: 'training.generate_reduced_embeddings',
            args: {
                ...params,
                npy_file,
                method: name,
                save_loc: loc,
                model_loc: $current_embedder_model_filepath,
            },
        };
    };

    const get_loc = async (processed_df_file: string) => {
        if (!processed_df_file) return;
        const dir = await path.dirname(processed_df_file);
        loc = await path.join(dir, name);
        if (!(await fs.exists(loc))) return;
    };

    $: get_loc($loaded_files?.final_processed_file?.value);

    type ParamValue = { value: number | string; description: string };

    let default_params: Record<string, number | string> = {};

    const entries = DR_default_params[name] as Record<string, ParamValue>;

    Object.entries(entries).forEach(([key, value]) => {
        default_params[key] = value.value;
        params[key] = value.value;
    });
</script>

<div class="grid gap-2">
    <CustomSelect bind:value={$embedding} items={embeddings} label="Embedder" />
    <SaveAndLoadState {loc} {default_params} bind:params unique_ext={`.${name.toLowerCase()}.json`} />
    <div class="divider"></div>
    <div class="text-md">Basic {name.toUpperCase()} Parameters</div>

    <div class="flex-gap items-start flex-wrap">
        {#each Object.entries(DR_default_params[name]) as [key, obj]}
            {#if obj.options}
                <CustomSelect
                    bind:value={params[key]}
                    label={key}
                    items={obj.options.map(f => `${f}`)}
                    hoverHelper={obj.description}
                    helperHighlight="default: {obj.value}"
                />
            {:else}
                <CustomInput
                    bind:value={params[key]}
                    type={typeof obj.value}
                    step={typeof obj.value === 'number' && obj.value < 1 ? '0.1' : ''}
                    label={key}
                    hoverHelper={obj.description}
                    helperHighlight="default: {obj.value}"
                />
            {/if}
        {/each}
    </div>
    <div class="divider"></div>
    <Loadingbtn callback={generate_reduced_embeddings} subprocess={true} />
    <slot />
</div>
