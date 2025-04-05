<script lang="ts">
    import { loaded_files } from './stores';
    import LoadedFileInfos from '$pages/training/embedding/LoadedFileInfos.svelte';

    export let id: string = 'meta-info-container';
    export let display: string = 'none';
</script>

<div class="grid content-start gap-2 p-5 overflow-auto max-h-[90vh]" {id} style:display>
    <h2>Loaded file informations</h2>
    <LoadedFileInfos on:refresh={e => ($loaded_files = e.detail)} />
    <div class="divider"></div>
</div>
