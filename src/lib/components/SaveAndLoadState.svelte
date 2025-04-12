<script lang="ts">
    import { Download, Save, RotateCcw, RefreshCcw, ExternalLink } from 'lucide-svelte/icons';
    import CustomSelect from './CustomSelect.svelte';

    export let params: Record<string, any>;
    export let default_params: Record<string, any>;
    export let loc: string;
    export let unique_ext: string = '.json';
    export let filename: string = 'default';
    export let typed_filename: string = '';
    export let saved_config_file: string = '';

    let items: string[] = [];

    const get_all_items_in_loc = async (loc: string, log = true) => {
        if (!(await fs.exists(loc))) return;
        const files = await fs.readDir(loc);
        items = files.filter(f => f.isFile && f.name.endsWith(unique_ext)).map(f => f.name.replace(unique_ext, ''));
        console.log({ files, items });
        if (items.length > 0) filename ||= items[0];
        if (log) toast.success(`Parameters loaded`);
    };

    $: loc && get_all_items_in_loc(loc, false);
    let use_input = false;
    const dispatch = createEventDispatcher();

    $: path.join(loc, `${filename}${unique_ext}`).then(r => (saved_config_file = r));
    onMount(() => {
        typed_filename = filename;
    });
</script>

<div class="flex-gap items-end m-auto border border-solid border-black p-1 rounded">
    <CustomSelect
        class="min-w-xl"
        label={`${filename}${unique_ext}`}
        bind:value={filename}
        {items}
        enable_use_input
        bind:use_input
        on:change={() => (typed_filename = filename)}
    >
        <svelte:fragment slot="pre-within">
            <button
                class="btn btn-sm btn-square btn-outline join-item"
                on:click={async () => await get_all_items_in_loc(loc)}
            >
                <RefreshCcw size="20" />
            </button>
        </svelte:fragment>
    </CustomSelect>
    <button class="btn btn-sm btn-outline" on:click={() => (params = structuredClone(default_params))}>
        <RotateCcw />
        <span>Reset</span>
    </button>
    <button
        class="btn btn-sm btn-outline"
        on:click={async () => {
            if (!(await fs.exists(loc))) return toast.error(`"${loc}" location doesn't exists`);
            const contents = await readJSON(saved_config_file);
            if (!contents) {
                toast.error('No state found');
                return;
            }
            params = contents;
            dispatch('load', { params });
            toast.success('State loaded');
        }}
    >
        <Download />
        <span>Load</span>
    </button>
    <button
        class="btn btn-sm btn-outline"
        on:click={async () => {
            if (!(await fs.exists(loc))) await fs.mkdir(loc);
            filename = filename.replace(unique_ext, '');
            const saved = await writeJSON(saved_config_file, params);
            if (!saved) return;
            await get_all_items_in_loc(loc);
            use_input = false;
            dispatch('save', { params });
        }}
    >
        <Save />
        <span>Save</span>
    </button>
    {#await fs.exists(loc) then loc_exists}
        {#if loc_exists}
            <button
                class="btn btn-sm btn-outline"
                on:click={async () => {
                    if (!(await fs.exists(loc))) return toast.error('Invalid location: ' + loc);
                    await open_filepath(loc);
                }}
            >
                <span>Open location</span>
                <ExternalLink size="20" />
            </button>
        {/if}
    {/await}
</div>
