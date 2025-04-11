<script lang="ts">
    import { Download, Save, RotateCcw, RefreshCcw } from 'lucide-svelte/icons';
    import CustomSelect from './CustomSelect.svelte';

    export let params: Record<string, any>;
    export let default_params: Record<string, any>;
    export let loc: string;
    export let unique_ext: string = '.json';

    let filename: string = 'default';
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
</script>

<div class="flex-gap items-end m-auto border border-solid border-black p-1 rounded">
    <CustomSelect
        class="min-w-xl"
        label={`${filename}${unique_ext}`}
        bind:value={filename}
        {items}
        enable_use_input
        bind:use_input
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
            const file = await path.join(loc, `${filename}${unique_ext}`);
            const contents = await readJSON(file);
            if (!contents) {
                toast.error('No state found');
                return;
            }
            params = contents;
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
            const file = await path.join(loc, `${filename}${unique_ext}`);
            const saved = await writeJSON(file, params);
            if (!saved) return;
            await get_all_items_in_loc(loc);
            use_input = false;
        }}
    >
        <Save />
        <span>Save</span>
    </button>
</div>
