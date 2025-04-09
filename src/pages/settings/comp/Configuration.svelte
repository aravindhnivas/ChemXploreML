<script lang="ts">
    import { background_color, text_color } from '$settings/stores';
    import {
        developerMode,
        serverCurrentStatus,
        pythonpath,
        pythonscript,
        pyServerReady,
        pyVersion,
        umdapyVersion,
        redis_server_mode,
        server_timeout_in_minutes,
        umdapy,
    } from '$lib/pyserver/stores';
    import { fontSize } from '$lib/stores/system';
    import { Checkbox } from '$components/index';
    import { fetchServerROOT, start_and_check_umdapy_with_toast } from '$lib/pyserver/umdapyServer';
    import { install_umdapy_from_zipfile } from '$settings/utils/download-assets';
    import { check_umdapy_assets_status } from '$settings/utils/assets-status';
    import PyServerControl from '$settings/config/PyServerControl.svelte';
    import Accordion from '@smui-extra/accordion';
    import TerminalBox from '$lib/components/TerminalBox.svelte';
    import { serverInfo } from '$settings/utils/stores';
    import BrowseFile from '$lib/components/BrowseFile.svelte';
    import { Download, ExternalLink, RefreshCcw } from 'lucide-svelte/icons';
    import CustomInput from '$lib/components/CustomInput.svelte';
    import Loadingbtn from '$lib/components/Loadingbtn.svelte';
    import { asset_download_required } from '$settings/utils/stores';

    onMount(async () => {
        console.log('Mounting Configuration');

        if (import.meta.env.DEV) {
            if (!$umdapy.includes('dev')) {
                $umdapy += '-dev';
            }
            if (!$pyServerReady) {
                await oO(fetchServerROOT());
            }
        }

        if (import.meta.env.PROD) {
            $umdapy = import.meta.env.VITE_pypackage;
            if (!$pyServerReady) await start_and_check_umdapy_with_toast();
        }
    });
</script>

<div class="flex gap-2">
    <CustomInput bind:value={$fontSize} label="font-size" type="number" max="25">
        <svelte:fragment slot="post-input-within">
            <button
                on:click={() => {
                    $fontSize = 16;
                    toast.success('Default font-size is set');
                }}><RefreshCcw size="18" /></button
            >
        </svelte:fragment>
    </CustomInput>
    <CustomInput lock bind:value={$server_timeout_in_minutes} label="server-timeout" type="number" max="25" />
    <CustomInput bind:value={$background_color} label="background color" />
    <CustomInput bind:value={$text_color} label="text color" />
</div>
<div class="divider"></div>
<div class="flex-center justify-between">
    <div class="">
        {#if $pyServerReady && $pyVersion}
            <div class="badge badge-success">Python: {$pyVersion} (umdapy: {$umdapyVersion})</div>
        {:else}
            <div class="badge badge-error">Invalid python</div>
        {/if}
        <div class="badge badge-{$serverCurrentStatus.type}">{$serverCurrentStatus.value}</div>
    </div>
    <div class="flex gap-2">
        <Checkbox bind:value={$redis_server_mode} label="Redis-server" />
        <Checkbox bind:value={$developerMode} label="Developer mode" />
    </div>
</div>

<div class="flex items-end gap-1">
    <CustomInput bind:value={$umdapy} label="Python program" lock />
    <Loadingbtn
        name="get PyVersion"
        callback={() => {
            if (!$pyServerReady) {
                toast.error('start umdapy server first!');
                return;
            }
            return { pyfile: 'getVersion', args: [''] };
        }}
        on:result={e => {
            console.log(e.detail);
            const { dataFromPython } = e.detail;
            console.log(dataFromPython);
            if (!dataFromPython) return;

            console.log('Received data from python');
            $pyVersion = dataFromPython.python;
            $umdapyVersion = dataFromPython.umdapy;
            if ($umdapyVersion < import.meta.env.VITE_PY_MIN_VERSION) {
                $asset_download_required = true;
            }
        }}
    />
</div>

{#if $developerMode}
    <BrowseFile bind:filename={$pythonpath} label="Enter python location or python keyword" />
    <BrowseFile bind:filename={$pythonscript} directory={true} label="Python source file" />
{/if}

<div class="flex gap-1 mt-3">
    <button
        class="btn btn-sm btn-outline"
        on:click={async () => {
            await check_umdapy_assets_status({ installation_request: true });
        }}>check-umdapy-assets</button
    >

    <button class="btn btn-sm btn-outline" on:click={async () => await open_filepath(await path.appLocalDataDir())}>
        APP Local data <ExternalLink />
    </button>
    <button class="btn btn-sm btn-outline" on:click={async () => await open_filepath(await path.appLogDir())}>
        Logs <ExternalLink />
    </button>

    <button class="btn btn-sm btn-outline" on:click={async () => await open_filepath(await path.resourceDir())}>
        ResourceDir <ExternalLink />
    </button>

    <button
        class="btn btn-sm btn-outline ml-auto"
        on:click={async () => {
            await oO(install_umdapy_from_zipfile());
        }}>Install from ZIPfile <Download /></button
    >
</div>

<div class="accordion-container">
    <Accordion>
        <PyServerControl />
    </Accordion>
</div>
<TerminalBox bind:terminal={$serverInfo} />
