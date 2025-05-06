<script lang="ts">
    import { active_page_id, active_page_child_id, navigationConfig } from '$pages/pages';
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import { ChevronRight, ChevronLeft } from 'lucide-svelte/icons';

    export let page_name: PAGES = 'Home';
    export let pane_size = 20;
    export let pane_min_size = 5;
    export let pane_max_size = 20;

    const id = $navigationConfig[page_name].id;
    const page = $navigationConfig[page_name];

    setContext<PAGES>('page_name', page_name);
    setContext<string>('page_id', id);
    setContext<NavigationPage>('page', page);

    onMount(() => {
        if (!$active_page_child_id[page_name]) {
            $active_page_child_id[page_name] = page.children?.[0]?.id ?? '';
        }
    });

    const page_title = $navigationConfig[page_name].name;

    let show_sidebar = false;
    const toggle_sidebar = () => {
        pane_size = show_sidebar ? pane_min_size : 20;
    };
    onMount(() => {
        pane_size = pane_min_size;
    });
    $: if (pane_size <= pane_min_size) {
        show_sidebar = false;
    } else if (pane_size >= 2 * pane_min_size) {
        show_sidebar = true;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<Splitpanes
    theme="my-theme"
    horizontal={false}
    {id}
    style="display: {$active_page_id === id ? 'flex' : 'none'};"
    class="card shadow-xl animate__animated animate__fadeIn h-full w-full overflow-hidden rounded-none"
>
    {#if page.children.length > 0}
        <Pane bind:size={pane_size} minSize={pane_min_size} maxSize={pane_max_size}>
            <div class="bg-base-200/15 overflow-auto h-full rounded-xl">
                <div class="m-2">
                    {#if show_sidebar}
                        <button class="btn btn-xs btn-outline w-max" on:click={toggle_sidebar}>
                            <ChevronLeft size={20} />
                        </button>
                    {:else}
                        <button class="btn btn-xs btn-outline w-max" on:click={toggle_sidebar}>
                            <ChevronRight size={20} />
                        </button>
                    {/if}
                </div>

                <ul class="menu rounded-box gap-2 overflow-hidden" class:items-center={!show_sidebar}>
                    {#each page.children as { name, id, icon } (id)}
                        <li
                            class:items-center={!show_sidebar}
                            class:w-max={!show_sidebar}
                            on:click={() => ($active_page_child_id[page_name] = id)}
                        >
                            <span class:active={$active_page_child_id[page_name] == id}>
                                {#if icon}
                                    <svelte:component this={icon} class="w-4 h-4" />
                                {/if}
                                {#if show_sidebar}
                                    {name}
                                {:else if !icon}
                                    {name.slice(0, 2)}
                                {/if}
                            </span>
                        </li>
                    {/each}
                </ul>
            </div>
        </Pane>
    {/if}
    <slot active_children={$active_page_child_id[page_name]} {page_title} {page} />
</Splitpanes>
