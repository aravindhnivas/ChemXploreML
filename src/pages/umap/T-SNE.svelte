<script lang="ts">
    import { Construction } from 'lucide-svelte/icons';

    export let id: string = 'tsne-embedder-container';
    export let display: string = 'none';
</script>

<div class="grid content-start gap-2 p-5 overflow-auto max-h-[90vh]" {id} style:display>
    <h2>t-SNE</h2>
    <div class="flex gap-2">
        <Construction />
        <span class="text-sm text-gray-600/75">Under construction</span>
        <br />
    </div>
</div>
