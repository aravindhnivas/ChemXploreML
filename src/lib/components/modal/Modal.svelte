<script lang="ts">
    export let title: string = 'Title';
    export let label: string = 'Open';
    export let open: boolean = false;
    export let show_button: boolean = true;
    let dialog_element: HTMLDialogElement;

    const openModal = () => {
        if (!dialog_element) return toast.error('Dialog element not found');
        dialog_element.showModal();
        open = true;
    };

    const closeModal = () => {
        if (!dialog_element) return toast.error('Dialog element not found');
        dialog_element.close();
        open = false;
    };

    $: if (dialog_element && open) dialog_element.showModal();
    // $: console.log({ open });
</script>

<slot name="button-slot" {openModal} {label}>
    {#if show_button}
        <button class="flex btn btn-sm btn-outline" on:click={openModal}>{label}</button>
    {/if}
</slot>

<dialog bind:this={dialog_element} class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={closeModal}>✕</button>
        </form>
        <h3 class="text-lg font-bold">{title}</h3>
        <p class="py-4"><slot {openModal} {closeModal} /></p>
    </div>
</dialog>

<style>
    .modal-box {
        background-color: color(srgb 1 0.6247 0.31);
    }
</style>
