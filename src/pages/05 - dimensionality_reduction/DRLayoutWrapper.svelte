<script lang="ts">
    import { CustomInput, CustomSelect, Loadingbtn } from '$lib/components';
    import { all_files_loaded, loaded_files } from '$lib/meta-componenets/stores';
    import SaveAndLoadState from '$lib/components/SaveAndLoadState.svelte';
    import { current_embedder_model_filepath, embedding, embeddings } from '$pages/04 - embedd_molecule/stores';
    import { DR_default_params, dr_params_filename, dr_vector_file } from './stores';
    import Checkbox from '$lib/components/Checkbox.svelte';
    import { exists } from '@tauri-apps/plugin-fs';
    import Notification from '$lib/components/Notification.svelte';

    export let name: DRNames;

    let vector_file = '';
    let loc: string = '';
    let params: Record<string, number | string | null> = {};

    const generate_reduced_embeddings = async () => {
        if (!$current_embedder_model_filepath) {
            toast.error('Please select a model_file');
            return;
        }

        let parameter_file = await path.join(loc, `${$dr_params_filename[name]}.${name.toLowerCase()}.json`);
        // console.log(parameter_file);
        let parameter_file_exists = await fs.exists(parameter_file);
        if (!parameter_file_exists) {
            toast.warning('Please save the parameters file first!!');
            return;
        }

        if (await fs.exists($dr_vector_file[name])) {
            const overwrite = await dialog.confirm(
                `File already exisits. ${$dr_vector_file[name]}. Do you want to overwrite ?`,
                {
                    title: 'Overwrite ?',
                    kind: 'warning',
                },
            );
            if (!overwrite) return;
        }

        return {
            pyfile: 'training.generate_reduced_embeddings',
            args: {
                params,
                vector_file,
                dr_savefile: $dr_vector_file[name],
                embedder_loc: $current_embedder_model_filepath,
                method: name,
                embedder_name: $embedding,
                scaling,
            },
        };
    };

    const parse_loc = async (
        embedded_file: { value: string; valid: boolean; basename: string },
        config_name: string,
    ) => {
        if (!embedded_file.value) return console.warn('Invalid embedded_file');

        const dir = await path.dirname(embedded_file.value);
        const fname = embedded_file.basename.replace('.npy', '');
        const original_vec_filename = fname.split('_with')[0];
        const append_name = `with_${name.toLowerCase()}_${config_name}`;
        const dr_vec_fname = `${original_vec_filename}_${append_name}`;

        loc = await path.join(dir, `${name}_configs`);
        $dr_vector_file[name] = await path.join(dir, `${dr_vec_fname}.npy`);
        vector_file = await path.join(dir, `${original_vec_filename}.npy`);
    };

    $: parse_loc($loaded_files.embedded_file, $dr_params_filename[name]);
    let default_params: Record<string, number | string | null> = {};

    Object.entries(DR_default_params[name]).forEach(([key, value]) => {
        default_params[key] = value.value;
        params[key] = value.value;
    });

    let scaling = true;
    let saved_config_file = '';
    let refresh_state = false;
</script>

<div class="grid gap-2">
    <CustomSelect bind:value={$embedding} items={embeddings} label="Embedder" />
    <SaveAndLoadState
        bind:typed_filename={$dr_params_filename[name]}
        bind:params
        bind:saved_config_file
        {loc}
        {default_params}
        unique_ext={`.${name.toLowerCase()}.json`}
        on:save={e => {
            refresh_state = !refresh_state;
        }}
    />
    <div class="grid gap-2">
        <pre class="text-sm break-all whitespace-normal"><span class="badge badge-sm">loc</span> - {loc}</pre>
        <pre class="text-sm break-all whitespace-normal"><span class="badge badge-sm">saved_config_file</span
            > - {saved_config_file}</pre>
        <pre class="text-sm break-all whitespace-normal"><span class="badge badge-sm">vector_file</span
            > - {vector_file}</pre>
        <pre class="text-sm break-all whitespace-normal">
            <span class="badge badge-sm">dr_vector_file</span> - {$dr_vector_file[name]}
        </pre>
    </div>
    <div class="divider"></div>
    <div class="text-md">Basic Parameters</div>

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
                    on:change={() => {
                        if (obj.type === 'number') params[key] = Number(params[key]);
                    }}
                />
            {/if}
        {/each}
    </div>
    <div class="divider"></div>
    <Checkbox bind:value={scaling} label="scaling" />
    <div class="divider"></div>
    {#key refresh_state}
        {#await fs.exists(saved_config_file) then file_exists}
            {#if file_exists}
                <Loadingbtn callback={generate_reduced_embeddings} subprocess={true} />
            {:else}
                <Loadingbtn callback={generate_reduced_embeddings} subprocess={true} disabled />
                <Notification
                    message="Please save the config parameter to compute"
                    type="warning"
                    dismissable={false}
                />
            {/if}
        {/await}
    {/key}
</div>
