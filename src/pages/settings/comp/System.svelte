<script lang="ts">
    import { RAM_SIZE, CPU_COUNT } from '$lib/stores/system';
    import { pyVersion, pyPackageVersion } from '$lib/pyserver/stores';

    onMount(async () => {
        logger.info('About page mounted');
        system_info.platform = await platform();
        system_info.arch = await arch();
        logger.info(system_info);
    });

    const system_info = {
        platform: '',
        arch: '',
    };
</script>

<div class="grid grid-cols-5 w-[350px] gap-2">
    <div class="col-span-3">Platform</div>
    <span class="col-span-2 badge badge-dark">{system_info.platform}-{system_info.arch}</span>

    <div class="col-span-3">RAM</div>
    <span class="col-span-2 badge badge-dark">{$RAM_SIZE.toFixed(0)} GB</span>

    <div class="col-span-3">CPU</div>
    <span class="col-span-2 badge badge-dark">{$CPU_COUNT.toFixed(0)} core</span>

    <div class="col-span-5 divider"></div>

    <div class="col-span-3">ChemXploreML</div>
    {#await getVersion() then value}
        <span class="col-span-2 badge badge-dark">v{value}</span>
    {/await}

    <div class="col-span-3">Tauri</div>
    {#await getTauriVersion() then value}
        <span class="col-span-2 badge badge-dark">v{value}</span>
    {/await}

    <div class="col-span-3">Python</div>
    <span class="col-span-2 badge badge-dark" class:badge-error={!$pyVersion}>{$pyVersion || 'unknown'}</span>

    <div class="col-span-3">{import.meta.env.VITE_pypackage}</div>
    <span class="col-span-2 badge badge-dark" class:badge-error={!$pyPackageVersion}
        >v{$pyPackageVersion || 'unknown'}</span
    >
</div>

<img src="/icons/icon.png" alt="ChemXploreML Logo" class="w-32 h-32 m-auto" />
