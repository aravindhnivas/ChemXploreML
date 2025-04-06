<script lang="ts">
    import { background_color, text_color } from '$pages/settings/stores';
    import { RAM_SIZE, CPU_COUNT, NPARTITIONS, fontSize } from '$lib/stores/system';
    import { Toaster } from 'svelte-sonner';
    import * as pages from './pages';
    import Footer from '$lib/layouts/Footer.svelte';
    import PreModal from '$utils/PreModal.svelte';
    import { typeSafeObjectKeys } from '$lib/utils';
    import { active_page_id, APP_IDS } from '$lib/index';

    let nav_tabs: { tab: string; component: any; id: string }[] = [];
    Object.values($APP_IDS).forEach(value => {
        const { name, icon, id } = value;
        nav_tabs.push({ tab: name, component: icon, id });
    });
    console.log('nav_tabs', nav_tabs);

    let html: HTMLElement;

    onMount(async () => {
        const [total_memory, cpu_count] = await invoke<[number, number]>('get_sysinfo');
        RAM_SIZE.set(total_memory / 1024 / 1024 / 1024);
        CPU_COUNT.set(cpu_count);

        console.log('RAM_SIZE', $RAM_SIZE);
        console.log('CPU_COUNT', $CPU_COUNT);

        const cpu_npartitions = $CPU_COUNT * 5;
        const ram_npartitions = (($RAM_SIZE - 4) * 1024) / 200;
        const max_npartitions = Math.max(cpu_npartitions, ram_npartitions, 50);

        NPARTITIONS.set(Math.floor(max_npartitions));
        html = document.getElementsByTagName('html')[0];
    });

    $: if (html && $fontSize && $fontSize < 25 && $fontSize > 5) {
        html.style.fontSize = `${$fontSize}px`;
    }

    async function handleKeydown(event: KeyboardEvent) {
        const platformName = await platform();
        const cond = platformName === 'macos' ? event.metaKey : event.ctrlKey;
        if (cond && event.key === '=') {
            $fontSize += 1;
        } else if (cond && event.key === '-') {
            $fontSize -= 1;
        }
    }

    // $: applyGlobalStyles($background_color, $text_color);
    function applyGlobalStyles(bg_color: string, text_color: string = 'black') {
        console.log('applyGlobalStyles', bg_color, text_color);
        document.body.style.backgroundColor = $background_color;
        document.body.style.color = $text_color;
        const html_el = document.documentElement;
        html_el.style.setProperty('--background-color', $background_color);
        html_el.style.setProperty('--text-color', $text_color);
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<Toaster position="bottom-left" richColors />
<PreModal />
<div class="parent w-full h-full">
    <header class=" shadow-xl p-2">
        <div role="tablist" class="tabs tabs-boxed w-max rounded-xl bg-base-200/50">
            {#each nav_tabs as { tab, component, id } (id)}
                <!-- svelte-ignore a11y-interactive-supports-focus -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    on:click={() => {
                        $active_page_id = id;
                    }}
                    role="tab"
                    class="flex-center tab transition-all duration-300 ease-in-out"
                    class:tab-active={$active_page_id === id}
                >
                    {#if component}
                        <svelte:component this={component}></svelte:component>
                    {/if}
                    <span class="font-semibold">{tab.toLocaleUpperCase()}</span>
                </div>
            {/each}
        </div>
    </header>
    <main>
        {#each typeSafeObjectKeys($APP_IDS) as name}
            <svelte:component this={pages[name]} />
        {/each}
    </main>
    <footer class="border-t border-t-black"><Footer /></footer>
</div>

<style>
    .parent {
        display: grid;
        grid-template-rows: auto 1fr auto;
        grid-template-columns: 1fr;
        gap: 0.5em;
    }

    main {
        display: grid;
        overflow: auto;
        height: 100%;
    }
</style>
