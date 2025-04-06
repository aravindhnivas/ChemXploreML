<script lang="ts">
    export let display = 'grid';

    let className = '';
    export { className as class };

    const active_page_child_id = getContext('page_children');
</script>

<div
    class="p-5 w-ful h-full content-start gap-1 animate__animated animate__fadeIn overflow-auto {className}"
    style:display
>
    <slot />
</div>
