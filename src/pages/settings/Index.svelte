<script lang="ts">
    import Page from '$pages/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import { Configuration, Console, System, Update, ProcessMonitor, Credit, License } from '.';
    import type { SvelteComponent } from 'svelte';

    const page_name: PAGES = 'Settings';
    const components: Record<string, typeof SvelteComponent<any>> = {
        configuration: Configuration,
        update: Update,
        console: Console,
        'process-monitor': ProcessMonitor,
        system: System,
        credit: Credit,
        license: License,
    };
</script>

<Page {page_name} pane_size={20}>
    <svelte:fragment let:active_children let:page>
        <Pane>
            <div class="bg-base-200/15 overflow-auto h-full mx-3 px-5 py-2 rounded-xl">
                {#each page.children as { id, title, description }}
                    {@const component = components[id]}
                    <div {id} style:display={active_children === id ? '' : 'none'} class="grid gap-2">
                        <h1>{title}</h1>
                        <div class="text-md">{description}</div>
                        <div class="divider"></div>
                        <svelte:component this={component} />
                    </div>
                {/each}
            </div>
        </Pane>
    </svelte:fragment>
</Page>
