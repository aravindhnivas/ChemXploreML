<script lang="ts">
    import { isError } from 'ts-try';
    import { HelpCircle, ExternalLink, LockKeyhole, UnlockKeyhole } from 'lucide-svelte/icons';
    import type { DialogFilter } from '$lib/utils';

    export let disabled = false;
    export let filename = '';
    export let helper = '';
    export let label = '';
    export let directory = false;
    export let filters: DialogFilter[] = [];
    export let btn_name = `Browse ${directory ? 'directory' : 'file'}`;
    export let callback: null | ((filename: string) => Promise<void>) = null;
    export let lock: boolean = false;
    export let enable_lock: boolean = false;

    let className = '';
    export { className as class };

    const dispatch = createEventDispatcher();

    const browse_file = async () => {
        if (disabled) {
            toast.error('This field is disabled');
            return;
        }
        const result = await dialog.open({
            directory,
            filters,
        });
        if (!result) return;
        if (typeof result === 'string') {
            filename = result;
        } else {
            filename = result[0];
        }
        if (filename) dispatch('file_selected', filename);
    };

    const load_callback = async () => {
        if (disabled) {
            toast.error('This field is disabled');
            return;
        }
        try {
            if (!callback) return toast.error('No load callback provided');
            if (!filename) return toast.error('No file selected');
            const result = await callback(filename);
            toast.success('File loaded successfully: ' + (await path.basename(filename)));
            return result;
        } catch (error) {
            if (typeof error === 'string') toast.error(error);
            else if (isError(error)) toast.error(error.message);
            else toast.error('An error occurred');
        }
    };
</script>

<div class="flex flex-col gap-1 w-full {className}">
    <div class="flex">
        {#if label}
            <span class="text-sm pl-1"
                >{label} (<em>{filename.split('/').at(-1) || `Choose a ${directory ? 'directory' : 'file'}`}</em>)</span
            >
        {:else if filename && !directory}
            <span class="text-sm pl-1">Filename: <em>{filename.split('/').at(-1)}</em></span>
        {/if}
        {#if helper}
            <span class="flex items-center gap-0.5 text-xs ml-auto">
                <HelpCircle size="20" />
                <span>{helper}</span>
            </span>
        {/if}
    </div>
    <div class="join">
        {#if enable_lock}
            <button
                class="btn btn-sm btn-outline join-item"
                on:click={() => {
                    lock = !lock;
                }}
            >
                {#if lock}
                    <LockKeyhole size="16" />
                {:else}
                    <UnlockKeyhole size="16" />
                {/if}
            </button>
        {/if}
        <button class="btn btn-sm btn-outline join-item" on:click={browse_file} disabled={disabled || lock}>
            {btn_name}
        </button>
        <input
            type="text"
            class="input input-sm join-item w-full"
            bind:value={filename}
            disabled={disabled || lock}
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
        />
        {#if callback}
            <button class="btn btn-sm join-item" on:click={load_callback}>load</button>
        {/if}
        <button
            class="btn btn-sm btn-outline join-item"
            on:click={async () => {
                if (directory) await open_filepath(filename);
                else await open_filepath(await path.dirname(filename));
            }}><ExternalLink /></button
        >
    </div>
</div>
