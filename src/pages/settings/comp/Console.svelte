<script lang="ts">
    import { terminal_log } from '$settings/utils/stores';
    import Layout from './layout/Layout.svelte';
    import TerminalBox from '$lib/components/TerminalBox.svelte';
    export let display = 'grid';
</script>

<Layout {display} class="pl-5">
    <h1>Console</h1>
    <TerminalBox bind:terminal={$terminal_log} />
</Layout>
