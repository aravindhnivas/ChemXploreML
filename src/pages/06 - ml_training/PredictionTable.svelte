<script lang="ts">
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
</script>

{#if prediction_table_data.length > 0}
    <div class="flex-gap w-full justify-end">
        <button class="btn btn-sm btn-outline w-max" on:click={clear_table}> Clear table </button>
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
