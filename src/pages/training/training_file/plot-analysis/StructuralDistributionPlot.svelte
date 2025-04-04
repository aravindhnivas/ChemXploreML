<script lang="ts">
    import { active_tab, structuralDistributionFilter } from './stores';
    import BaseLayout from './BaseLayout.svelte';
    import Chip, { Set, Text } from '@smui/chips';
    import Plot from 'svelte-plotly.js';
    import { difference } from 'lodash-es';

    const name = 'structural_distribution';

    let plotted = false;
    let choices: string[] = [];
    let selected: string[] = [];

    let plotData: Partial<Plotly.PieData>[] = [];

    const GetData = getContext<(name: string) => Promise<{ x: string[]; y: number[] }>>('GetData');

    const plot_data = async () => {
        const data = await GetData(`${name}.csv`);
        if (!data) return;

        const { x, y } = data;

        choices = x;
        await tick();
        selected = [...choices];

        plotData = [
            {
                labels: x,
                values: y,
                type: 'pie',
                textinfo: 'label+value+percent',
                textposition: 'outside',
                // insidetextorientation: 'radial',
            },
        ];
        plotted = true;
    };

    $: filter_structures = difference(choices, selected);
    $: if (filter_structures) {
        $structuralDistributionFilter.filter_structures = [...filter_structures];
    }
</script>

<BaseLayout {name} hidden={$active_tab !== name} on:plot={plot_data}>
    {#if plotted}
        <h3>Filtering</h3>
        <Set chips={choices} let:chip filter bind:selected>
            <Chip {chip} touch>
                <Text>{chip}</Text>
            </Chip>
        </Set>
        <pre class="status">Selected: {selected.length} / {choices.length} categories</pre>
    {/if}
    <div style="height: 500px;">
        <Plot data={plotData} fillParent={true} debounce={250} />
    </div>
</BaseLayout>
