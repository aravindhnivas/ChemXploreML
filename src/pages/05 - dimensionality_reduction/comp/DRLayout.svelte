<script lang="ts">
    import { CustomInput, CustomSelect, Loadingbtn } from '$lib/components';
    import { loaded_files } from '$lib/meta-componenets/stores';
    import SaveAndLoadState from '$lib/components/SaveAndLoadState.svelte';
    import {
        current_embedder_model_filepath,
        embedd_savefile,
        embedding,
        embeddings,
    } from '$pages/04 - embedd_molecule/stores';
    import { DR_default_params, dr_params_filename, dr_vector_file } from '../stores';
    import Checkbox from '$lib/components/Checkbox.svelte';

    export let loc: string;
    export let name: DRNames;
    export let params: Record<string, number | string> = {};

    let processed_df_file = '';
    // let dr_file = '';
    const generate_reduced_embeddings = async () => {
        if (!$current_embedder_model_filepath) {
            toast.error('Please select a model_file');
            return;
        }

        if (!(await fs.exists(processed_df_file))) {
            toast.error('Invalid processed_df file');
            return;
        }

        let parameter_file = await path.join(loc, `${$dr_params_filename[name]}.${name.toLowerCase()}.json`);
        console.log(parameter_file);
        let parameter_file_exists = await fs.exists(parameter_file);
        if (!parameter_file_exists) {
            toast.warning('Please save the parameters file first!!');
            return;
        }

        if (await fs.exists($dr_vector_file[name])) {
            const overwrite = await dialog.confirm('File already exisits. Do you want to overwrite ?', {
                title: 'Overwrite ?',
                kind: 'warning',
            });
            if (!overwrite) return;
        }

        return {
            pyfile: 'training.generate_reduced_embeddings',
            args: {
                params,
                processed_df_file,
                dr_file: $dr_vector_file[name],
                embedder_loc: $current_embedder_model_filepath,
                method: name,
                embedder_name: $embedding,
                scaling,
            },
        };
    };

    const get_loc = async (file: string) => {
        if (!(await fs.exists(file))) return;
        const dir = await path.dirname(file);
        loc = await path.join(dir, name);
        $dr_vector_file[name] = await path.join(
            loc,
            `${$embedd_savefile}_${name.toLocaleLowerCase()}_${$dr_params_filename[name]}.npy`,
        );
    };

    $: processed_df_file = $loaded_files?.final_processed_file?.value;
    $: get_loc(processed_df_file);

    type ParamValue = { value: number | string; description: string };

    let default_params: Record<string, number | string> = {};

    const entries = DR_default_params[name] as Record<string, ParamValue>;

    Object.entries(entries).forEach(([key, value]) => {
        default_params[key] = value.value;
        params[key] = value.value;
    });

    // let param_filename: string = 'default';
    let scaling = true;
</script>

<div class="grid gap-2">
    <CustomSelect bind:value={$embedding} items={embeddings} label="Embedder" />
    <SaveAndLoadState
        bind:filename={$dr_params_filename[name]}
        bind:params
        {loc}
        {default_params}
        unique_ext={`.${name.toLowerCase()}.json`}
    />
    <div class="grid gap-2">
        <div class="text-sm break-words">loc - {loc}</div>
        <div class="text-sm break-all">processed_df_file - {processed_df_file}</div>
        <div class="text-sm break-all">dr_file - {$dr_vector_file[name]}</div>
    </div>
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
    <Checkbox bind:value={scaling} label="scaling" />
    <div class="divider"></div>
    <Loadingbtn callback={generate_reduced_embeddings} subprocess={true} />
    <slot />
</div>
