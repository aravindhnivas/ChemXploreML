<script lang="ts">
    import { killPID } from '$settings/utils/network';
    import { genericStartServer } from './';
    import { CustomInput } from '$lib/components';
    import type { Child } from '@tauri-apps/plugin-shell';

    export let id: string;
    export let pyfile: string = 'server';
    export let args: Record<string, any> = {};
    export let port: number = 8000;

    let serverReady = false;
    let serverFailed = false;
    let starting_server = false;
    let port_lock = true;

    const stopServer = async () => {
        console.log('Stopping server...');
        if (pyChild) {
            pyChild.kill();
        }

        console.log('Killing PID:', $pid);
        if ($pid === 0) {
            console.log('No PID to kill');
            return;
        }
        await killPID([`${$pid}`]);
        serverReady = false;
        serverFailed = false;
        starting_server = false;
        console.log('Server stopped');
    };

    let start_btn: HTMLButtonElement;
    let stop_btn: HTMLButtonElement;

    // let pid: number | null = null;
    const pid = localWritable<number>(id + '_pid', 0);
    console.log(id + '_pid');

    // const port = localWritable<number>(id + '_port', 8000);
    let pyChild: Child;
    $: console.log(pyChild?.pid, $pid);
</script>

<div class="flex-gap items-end">
    <CustomInput bind:lock={port_lock} bind:value={port} label="ServerPORT" type="number" />
    <button
        bind:this={start_btn}
        disabled={(!serverFailed && serverReady) || (!serverFailed && starting_server)}
        class="btn btn-sm btn-outline"
        on:click={async () => {
            genericStartServer(start_btn, pyfile, { port, ...args });
        }}
        on:mount={e => {
            starting_server = true;
            serverReady = false;
            serverFailed = false;
            console.log(e.detail);
            pyChild = e.detail.pyChild;
            console.log('Child PID:', pyChild.pid);
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

    <CustomInput bind:value={$pid} label="PID" />
    <button bind:this={stop_btn} class="btn btn-sm btn-error" on:click={stopServer}>Stop Server</button>
</div>
