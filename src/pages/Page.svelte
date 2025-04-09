<script lang="ts">
    import { active_page_id, active_page_child_id, APP_IDS } from '$pages/pages';
    import { Pane, Splitpanes } from 'svelte-splitpanes';

    export let page_name: PAGES = 'Home';
    export let pane_size = 10;
    export let pane_min_size = 5;
    export let pane_max_size = 20;

    const id = $APP_IDS[page_name].id;
    const page_children = $APP_IDS[page_name].children;

    setContext('page_name', page_name);
    setContext('page_id', id);
    setContext('page_children', page_children);

    onMount(() => {
        if (!$active_page_child_id[page_name]) {
            $active_page_child_id[page_name] = page_children?.[0]?.id ?? '';
        }
    });

    const page_title = $APP_IDS[page_name].name;
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
    {#if page_children.length > 0}
        <Pane class="p-2" size={pane_size} minSize={pane_min_size} maxSize={pane_max_size}>
            <ul class="menu rounded-box gap-2">
                {#each page_children as { name, id, icon } (id)}
                    <li on:click={() => ($active_page_child_id[page_name] = id)}>
                        <span class:active={$active_page_child_id[page_name] == id}>
                            {#if icon}
                                <svelte:component this={icon} class="w-4 h-4 mr-2" />
                            {/if}
                            {name}
                        </span>
                    </li>
                {/each}
            </ul>
        </Pane>
    {/if}
    <slot active_children={$active_page_child_id[page_name]} {page_title} {page_children} />
</Splitpanes>
