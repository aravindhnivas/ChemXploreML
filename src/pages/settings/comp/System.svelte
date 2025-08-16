<script lang="ts">
    import { RAM_SIZE, CPU_COUNT } from '$lib/stores/system';
    import { pyVersion, pyPackageVersion, pyPackageArch } from '$lib/pyserver/stores';
    import { get_assets_zip_name } from '../utils/assets-zip-name';

    let assets_zip_name = '';

    onMount(async () => {
        logger.info('About page mounted');
        system_info.platform = await platform();
        system_info.arch = await arch();
        logger.info(system_info);

        assets_zip_name = await get_assets_zip_name();
        logger.info(assets_zip_name);
    });

    const system_info = {
        platform: '',
        arch: '',
    };
</script>

<div class="grid grid-cols-7 w-[450px] gap-2">
    <div class="col-span-3">Platform</div>
    <span class="col-span-4 badge badge-dark">{system_info.platform}-{system_info.arch}</span>

    <div class="col-span-3">RAM</div>
    <span class="col-span-4 badge badge-dark">{$RAM_SIZE.toFixed(0)} GB</span>

    <div class="col-span-3">CPU</div>
    <span class="col-span-4 badge badge-dark">{$CPU_COUNT.toFixed(0)} core</span>

    <div class="col-span-7 divider"></div>

    <div class="col-span-3">ChemXploreML</div>
    {#await getVersion() then value}
        <span class="col-span-4 badge badge-dark">v{value}</span>
    {/await}

    <div class="col-span-3">Tauri</div>
    {#await getTauriVersion() then value}
        <span class="col-span-4 badge badge-dark">v{value}</span>
    {/await}

    <div class="col-span-3">Python</div>
    <span class="col-span-4 badge badge-dark" class:badge-error={!$pyVersion}
        >{$pyVersion ? 'v' + $pyVersion : 'unknown'}
    </span>

    <div class="col-span-3">{import.meta.env.VITE_pypackage}</div>
    <span class="col-span-4 badge badge-dark" class:badge-error={!$pyPackageVersion}
        >v{$pyPackageVersion || 'unknown'} ({$pyPackageArch || 'unknown'})</span
    >

    <div class="col-span-3">Downloaded Assets</div>
    <span class="col-span-4 badge badge-dark">{assets_zip_name}</span>
</div>

<img src="/icons/icon.png" alt="ChemXploreML Logo" class="w-32 h-32 m-auto" />
