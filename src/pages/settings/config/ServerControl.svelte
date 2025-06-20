<script lang="ts">
    import { fetchServerROOT, updateServerInfo } from '$lib/pyserver';
    import { checkNetstat, killPID } from '../utils/network';
    import { serverInfo } from '../utils/stores';
    import { AxiosError } from 'axios';
    import { RefreshCcw } from 'lucide-svelte/icons';
    import { Checkbox, CustomInput } from '$lib/components';
    import SuppressedWarningsModal from './SuppressedWarningsModal.svelte';

    export let port: number;
    export let serverReady: boolean = false;
    export let serverFailed: boolean = false;
    export let pids: string[] = [];
    export let startServer: () => void;
    export let stopServer: () => void;
    export let connection: 'ws' | 'http' = 'http';
    export let suppress_warnings: boolean = false;
    export let debug = false;

    const killpids = async () => {
        if (!pids.length) return serverInfo.error('No PID to kill');
        await killPID(pids);
        serverReady = false;
        await updateServerInfo();
    };

    let starting_server = false;
    $: if (serverReady) starting_server = false;

    let port_lock = true;
    const fetch_port = async () => {
        if (port_lock) return toast.warning('Port is locked');
        const _port = await invoke<number>('get_tcp_port');
        if (_port) {
            port = _port;
            return;
        }
        return toast.error('Failed to fetch port');
    };

    const connect_websocket = async () => {
        // const [err] = await oO(fetchServerROOT());
        // if (err instanceof AxiosError) {
        //     console.log(err);
        //     serverInfo.error(err.code || 'unknown network error');
        // }
    };
</script>

<div class="grid gap-4">
    <div class="flex items-end gap-2">
        <Checkbox bind:value={debug} label="debug" />
        <CustomInput bind:lock={port_lock} bind:value={port} label="ServerPORT" type="number">
            <svelte:fragment slot="post-input-within">
                <button on:click={fetch_port} disabled={port_lock}><RefreshCcw size="18" /></button>
            </svelte:fragment>
        </CustomInput>
        <button
            disabled={(!serverFailed && serverReady) || (!serverFailed && starting_server)}
            class="btn btn-sm btn-outline"
            on:click={async () => {
                try {
                    starting_server = true;
                    await startServer();
                } catch (error) {
                    serverFailed = true;
                    console.log(error);
                    serverInfo.error('Failed to start server');
                }
            }}
        >
            <span>Start Server</span>
            <span class:loading={!serverFailed && starting_server} class="loading-spinner"></span>
        </button>
        <button
            class="btn btn-sm btn-error"
            on:click={async () => {
                await stopServer();
            }}>Stop Server</button
        >

        <Checkbox bind:value={suppress_warnings} label="Suppress Python warnings" />
        <SuppressedWarningsModal />
    </div>

    <div class="flex items-end gap-2">
        {#if connection === 'http'}
            <button
                class="btn btn-sm btn-outline"
                on:click={async () => {
                    const [err] = await oO(fetchServerROOT());
                    if (err instanceof AxiosError) {
                        console.log(err);
                        serverInfo.error(err.code || 'unknown network error');
                    }
                }}>Check Server connection</button
            >
        {:else}
            <button class="btn btn-sm btn-outline" on:click={connect_websocket}>Check ws connection</button>
        {/if}
        <button class="btn btn-sm btn-outline" on:click={async () => await checkNetstat(port)}>Check PORT status</button
        >

        <CustomInput
            value={pids.join(', ')}
            label="current port PID"
            on:change={e => {
                if (pids.length === 0 && e.target.value) {
                    pids = e.target.value.split(',');
                }
            }}
        />
        <button class="btn btn-sm btn-error" on:click={killpids}>kill PID</button>
    </div>
</div>
