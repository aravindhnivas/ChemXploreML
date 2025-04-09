<script lang="ts">
    import { Settings } from 'lucide-svelte/icons';
    import Dialog, { Title, Content, Actions } from '@smui/dialog';

    export let open: boolean = false;
    export let title: string = '';

    const dispatch = createEventDispatcher();
</script>

<button
    class="btn btn-sm btn-outline btn-square"
    on:click={() => {
        open = true;
        dispatch('open');
    }}><Settings size="20" /></button
>
<Dialog bind:open scrimClickAction="" surface$style="width: 850px; max-width: calc(100vw - 32px);">
    <Title>{title}</Title>
    <Content>
        <slot />
    </Content>
    <Actions>
        <button
            class="btn btn-sm btn-outline btn-error"
            on:click={() => {
                open = false;
                dispatch('close');
            }}
        >
            <span>Close</span>
        </button>
    </Actions>
</Dialog>
