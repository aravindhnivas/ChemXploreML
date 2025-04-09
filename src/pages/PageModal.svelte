<script lang="ts">
    import { Settings } from 'lucide-svelte/icons';
    import Dialog, { Title, Content, Actions } from '@smui/dialog';

    export let open: boolean = false;

    const dispatch = createEventDispatcher();
</script>

<button
    class="btn btn-sm btn-outline btn-square"
    on:click={() => {
        open = true;
        dispatch('open');
    }}><Settings size="20" /></button
>
<Dialog
    bind:open
    aria-labelledby="large-scroll-title"
    aria-describedby="large-scroll-content"
    surface$style="width: 850px; max-width: calc(100vw - 32px);"
>
    <Title>Title</Title>
    <Content>
        <slot />
    </Content>
    <Actions>
        <button
            class="btn btn-sm btn-outline"
            on:click={() => {
                open = false;
                dispatch('close');
            }}
        >
            <span>close</span>
        </button>
    </Actions>
</Dialog>
