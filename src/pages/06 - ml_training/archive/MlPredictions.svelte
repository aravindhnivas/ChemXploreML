<script lang="ts">
    import Predictions from '../Predictions.svelte';
    import Analysis from './Analysis.svelte';
    import CustomTabs from '$lib/components/CustomTabs.svelte';
    import { Binary, ChartCandlestick } from 'lucide-svelte/icons';

    let active_tab = 'Predictions';

    const tabs = [
        { tab: 'Predictions', component: Binary },
        { tab: 'Analysis', component: ChartCandlestick },
    ];
</script>

<div class="w-max">
    <CustomTabs {tabs} bind:active={active_tab} />
</div>
<div class="grid gap-2" class:hidden={active_tab !== 'Predictions'}>
    <Predictions />
</div>
<div class="grid gap-2" class:hidden={active_tab !== 'Analysis'}>
    <Analysis />
</div>
