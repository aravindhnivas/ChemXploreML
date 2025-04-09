<script lang="ts">
    import Page from '$pages/Page.svelte';
    import type { SvelteComponent } from 'svelte';
    import { Pane } from 'svelte-splitpanes';

    export let page_name: PAGES;
    export let child_components: Array<{ id: string; component: typeof SvelteComponent<any> }> = [];
</script>

<Page {page_name} pane_size={20}>
    <svelte:fragment let:active_children let:page_children>
        <Pane minSize={50} maxSize={90}>
            <div class="bg-base-200/15 overflow-auto h-full mx-3 px-5 py-2 rounded-xl">
                {#each child_components as { id, component } (component)}
                    <div {id} style:display={active_children === id ? '' : 'none'} class="grid gap-2">
                        <h1>{page_children.find(o => (o.id = id))?.title}</h1>
                        <div class="text-md">{page_children.find(o => (o.id = id))?.description}</div>
                        <div class="divider"></div>
                        <svelte:component this={component} />
                    </div>
                {/each}
            </div>
        </Pane>
    </svelte:fragment>
</Page>
