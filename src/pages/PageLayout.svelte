<script lang="ts">
    import Page from '$pages/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import type { SvelteComponent } from 'svelte';
    import { Settings } from 'lucide-svelte/icons';
    import PageModal from './PageModal.svelte';

    export let page_name: PAGES;
    export let child_components: Record<string, typeof SvelteComponent<any>> | null = null;
    export let component: typeof SvelteComponent<any> | null = null;

    const dispatch = createEventDispatcher();
</script>

<Page {page_name}>
    <svelte:fragment let:active_children let:page>
        <Pane minSize={80}>
            <div class="bg-base-200/15 overflow-auto h-full mx-3 px-5 py-2 rounded-xl">
                {#if child_components}
                    {#each page.children as { id, title, description, name } (id + title)}
                        <div {id} style:display={active_children === id ? '' : 'none'} class="grid gap-2">
                            <div class="grid gap-2">
                                <h1>{title}</h1>
                                <span class="text-md">{description}</span>
                            </div>

                            <div class="divider"></div>
                            <svelte:component this={child_components[id]} />
                        </div>
                    {/each}
                {:else if component}
                    <div class="grid gap-2">
                        <div class="flex justify-between">
                            <h1>{page.title}</h1>
                            <PageModal
                                title="Settings"
                                on:open={() => dispatch('open_modal', { page })}
                                on:close={() => dispatch('close_modal', { page })}
                            >
                                <slot name="modal" />
                            </PageModal>
                        </div>
                        <span class="text-md">{page.description}</span>
                    </div>

                    <div class="divider"></div>
                    <svelte:component this={component} />
                {:else}
                    <div class="text-xl">No component to render</div>
                {/if}
            </div>
        </Pane>
    </svelte:fragment>
</Page>
