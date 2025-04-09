<script lang="ts">
    import Page from '$pages/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import { Configuration, Console, System, Update, ProcessMonitor, Credit, License } from '.';
    import type { SvelteComponent } from 'svelte';

    const page_name: PAGES = 'Settings';
    const child_components: Array<{ id: string; component: typeof SvelteComponent<any> }> = [
        { id: 'configuration', component: Configuration },
        { id: 'update', component: Update },
        { id: 'console', component: Console },
        { id: 'process-monitor', component: ProcessMonitor },
        { id: 'system', component: System },
        { id: 'credit', component: Credit },
        { id: 'license', component: License },
    ];
</script>

<Page {page_name} pane_size={20}>
    <svelte:fragment let:active_children>
        <Pane minSize={80}>
            <div class="bg-base-200/15 overflow-auto h-full mx-3 px-5 py-2 rounded-xl">
                {#each child_components as { id, component }}
                    <div {id} style:display={active_children === id ? '' : 'none'} class="grid gap-2">
                        <svelte:component this={component} />
                    </div>
                {/each}
            </div>
        </Pane>
    </svelte:fragment>
</Page>
