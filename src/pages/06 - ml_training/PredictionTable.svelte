<script lang="ts">
    import { Trash2, Download } from 'lucide-svelte/icons';

    export let prediction_table_data: {
        id: string;
        smiles: string;
        model: string;
        embedder: string;
        pre_trained_model: string;
        prediction: string;
    }[];
    const columns = ['smiles', 'model', 'embedder', 'pre_trained_model', 'prediction'] as const;

    const clear_table = () => {
        prediction_table_data = [];
    };

    const download_table = async () => {
        const data = prediction_table_data.map(row => Object.values(row).slice(1).join(',')).join('\n');
        const filename = await dialog.save({
            filters: [{ name: 'CSV', extensions: ['csv'] }],
        });
        if (!filename) return;
        await fs.writeFile(filename, new TextEncoder().encode(data));
        toast.success('Table downloaded');
    };
</script>

{#if prediction_table_data.length > 0}
    <div class="flex-gap w-full justify-end">
        <button class="btn btn-sm btn-outline" on:click={download_table}>
            <Download class="w-4 h-4" />
            Download table
        </button>

        <button class="btn btn-sm btn-error" on:click={clear_table}>
            <Trash2 class="w-4 h-4" />
            Clear table
        </button>
    </div>

    <div style="height: 400px; width: 100%;" class="overflow-auto grid gap-2 content-start">
        <table class="table table-sm bg-base-100">
            <thead>
                <tr>
                    <th></th>
                    {#each columns as column (column)}
                        <th>{column}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each prediction_table_data as nrows, index (nrows.id)}
                    <tr class="hover:bg-base-200">
                        <th>{index}</th>
                        {#each columns as column}
                            <td class="select-text">{nrows[column]}</td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}
