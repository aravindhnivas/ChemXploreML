<script lang="ts">
    import { CheckCheck } from 'lucide-svelte/icons';
    import { training_column_name_X } from '$pages/03 - load_file/stores';
    import VirtualList from '@sveltejs/svelte-virtual-list';

    export let computed_time: string;
    export let data: EmbeddingState['file_mode'];
</script>

{#if data}
    {@const { invalid_smiles, saved_file } = data}

    <div class=" flex flex-col gap-1">
        <div class="flex-gap">
            {#if saved_file}
                <div role="alert" class="alert alert-info p-2">
                    <CheckCheck />
                    <span class="text-sm">(Computed in {computed_time}) File saved to: {saved_file}</span>
                </div>
            {/if}
            <button class="btn btn-sm btn-error w-max ml-auto" on:click={() => (data = undefined)}>X</button>
        </div>
        {#if invalid_smiles.length > 0}
            {@const invalid_smiles_indexed = invalid_smiles.map((smiles, ind) => ({ smiles, ind }))}

            <div class="border border-solid border-2 border-rounded p-2 grid gap-1">
                <pre class="status text-red-6">
                    <span class="underline"
                        >{invalid_smiles.length} invalid smiles or could not compute embeddings for the following {$training_column_name_X}:</span
                    >
                </pre>
                <div class="flex gap-1">
                    <!-- <span>Invalid smiles file: </span> -->
                    <div role="alert" class="alert p-2">
                        <span class="text-wrap break-all">{data.invalid_smiles_file}</span>
                    </div>
                </div>
                <VirtualList height="250px" items={invalid_smiles_indexed} let:item>
                    <div>
                        <span>{item.ind + 1}: </span><span class="select-text text-wrap break-all"> {item.smiles}</span>
                    </div>
                </VirtualList>
            </div>
        {/if}
    </div>
{/if}
