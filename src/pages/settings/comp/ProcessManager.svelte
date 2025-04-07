<script lang="ts">
    import { redis_server_mode, pyServerReady, pyServerURL } from '$lib/pyserver/stores';
    import { socket, socket_connection_status } from '$lib/websocket/stores';
    import Layout from './Layout.svelte';
    import Dashboard from '$pages/settings/dashboards/Dashboard.svelte';
    import { initializeSocket } from '$lib/websocket/utils';
    import Loadingbtn from '$lib/components/Loadingbtn.svelte';
    import CustomInput from '$lib/components/CustomInput.svelte';
    import StartStopServerControl from '$lib/start_stop_server/StartStopServerControl.svelte';

    export let display = 'grid';

    $: if ($socket_connection_status !== 'connected' && $pyServerReady && $redis_server_mode) {
        initializeSocket();
    }
    onDestroy(() => $socket?.disconnect());

    let wait_time = 1;
</script>

<Layout {display} class="pl-5">
    <h1>Process-Manager</h1>
    {#if import.meta.env.DEV}
        <div class="flex-gap items-end">
            <CustomInput bind:value={wait_time} label="Wait Time (s)" type="number" />
            <Loadingbtn
                subprocess={true}
                callback={() => {
                    return {
                        pyfile: 'wait_timer',
                        args: {
                            wait_time: Number(wait_time),
                        },
                    };
                }}
            />
        </div>
    {/if}

    <div class="flex gap-2 my-2">
        <button
            class="btn btn-sm btn-outline"
            class:btn-disabled={$socket_connection_status === 'connected'}
            on:click={() => initializeSocket()}>Connect</button
        >
        <button
            class="btn btn-sm btn-error"
            class:btn-disabled={$socket_connection_status !== 'connected'}
            on:click={() => $socket.disconnect()}>Disconnect</button
        >

        <Dashboard name="RQ-Dashboard" url={$pyServerURL + '/rq'} />
    </div>

    {#if $socket_connection_status === 'connected'}
        <div class="status-indicator connected">Connected to server</div>
    {:else if $socket_connection_status === 'disconnected'}
        <div class="status-indicator disconnected">Disconnected from server</div>
    {:else}
        <div class="status-indicator error">Connection error</div>
    {/if}

    {#if import.meta.env.DEV}
        <StartStopServerControl
            id="start-stop-server-control-redis"
            pyfile="start_redis_worker"
            args={{ listen: ['default'] }}
            port={6379}
        />
    {/if}
</Layout>

<style>
    .status-indicator {
        padding: 0.5rem;
        margin-bottom: 1rem;
        border-radius: 0.25rem;
    }

    .connected {
        background-color: #d4edda;
        color: #155724;
    }

    .disconnected {
        background-color: #fff3cd;
        color: #856404;
    }

    .error {
        background-color: #f8d7da;
        color: #721c24;
    }
</style>
