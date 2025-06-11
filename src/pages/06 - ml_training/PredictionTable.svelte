<script lang="ts">
    import { Trash2, Download, X } from 'lucide-svelte/icons';

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
            defaultPath: 'prediction_table.csv',
            canCreateDirectories: true,
            title: 'Download table as CSV',
        });
        if (!filename) return;
        await fs.writeFile(filename, new TextEncoder().encode(data));
        toast.success('Table downloaded');
    };

    const delete_row = (id: string) => {
        prediction_table_data = prediction_table_data.filter(row => row.id !== id);
    };
</script>

{#if prediction_table_data.length > 0}
    <div style="height: 400px; width: 100%;" class="overflow-auto grid gap-2 content-start">
        <table class="table table-sm bg-base-100">
            <thead>
                <tr>
                    <th>
                        <button class="btn btn-xs btn-outline" on:click={download_table}>
                            <Download size="14" />
                        </button>
                    </th>
                    {#each columns as column (column)}
                        <th>{column}</th>
                    {/each}
                    <th>
                        <button class="btn btn-xs btn-outline" on:click={clear_table}>
                            <Trash2 size="14" />
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each prediction_table_data as nrows, index (nrows.id)}
                    <tr class="hover:bg-base-200">
                        <th>{index}</th>
                        {#each columns as column}
                            <td class="select-text">{nrows[column]}</td>
                        {/each}
                        <td>
                            <button class="btn btn-xs btn-outline" on:click={() => delete_row(nrows.id)}>
                                <X size="14" />
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}
