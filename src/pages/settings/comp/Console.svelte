<script lang="ts">
    import { terminal_log } from '$settings/utils/stores';
    import TerminalBox from '$lib/components/TerminalBox.svelte';
</script>

<TerminalBox bind:terminal={$terminal_log} />
