<script lang="ts">
    import { killPID } from '$settings/utils/network';
    import { genericStartServer } from './';
    import { CustomInput } from '$lib/components';
    import type { Child } from '@tauri-apps/plugin-shell';

    export let id: string;

    let serverReady = false;
    let serverFailed = false;
    let starting_server = false;
    let port_lock = true;

    const startServer = async (e: MouseEvent) => {
        console.log('Starting server...');

        starting_server = true;
        serverReady = false;
        serverFailed = false;

        try {
            await sleep(1000); // Simulate server start delay
            serverReady = true;
        } catch (error) {
            serverFailed = true;
            console.error(error);
            console.log('Failed to start server:', error);
        } finally {
            starting_server = false;
            console.log('Server started:', { serverReady, serverFailed });
        }
    };

    const stopServer = async () => {
        console.log('Stopping server...');
        await sleep(1000); // Simulate server stop delay
        serverReady = false;
        serverFailed = false;
        starting_server = false;
        console.log('Server stopped');
    };

    let start_btn: HTMLButtonElement;
    let stop_btn: HTMLButtonElement;

    // let pid: number | null = null;
    const pid = localWritable<number | null>(id + '_pid', null);
    console.log(id + '_pid');

    const port = localWritable<number>(id + '_port', 8000);
    let pyChild: Child;
</script>

<div class="flex-gap items-end">
    <CustomInput bind:lock={port_lock} bind:value={$port} label="ServerPORT" type="number" />
    <button
        bind:this={start_btn}
        disabled={(!serverFailed && serverReady) || (!serverFailed && starting_server)}
        class="btn btn-sm btn-outline"
        on:click={async () => {
            genericStartServer(start_btn, 'server', $port);
        }}
        on:mount={e => {
            starting_server = true;
            serverReady = false;
            serverFailed = false;
            $pid = e.detail.pyChild.pid;
        }}
        on:start={e => {
            starting_server = false;
            serverReady = true;
        }}
        on:close={e => {
            starting_server = false;
            serverReady = false;
        }}
    >
        <span>Start Server</span>
        <span class:loading={starting_server} class="loading-spinner"></span>
    </button>
    <button bind:this={stop_btn} class="btn btn-sm btn-error" on:click={stopServer}>Stop Server</button>
</div>
