<script lang="ts">
    import { filtered_dir, YDistributionFilter } from '../stores';
    import { CustomInput, Loadingbtn } from '$lib/components';
    import { training_column_name_y, training_file } from '../../stores';
    import { use_dask } from '$lib/stores/system';
    import { min_yvalue, max_yvalue } from './stores';
    import Notification from '$lib/components/Notification.svelte';
    import { Check, CircleAlert } from 'lucide-svelte/icons';

    export let data: YDistributionStats;

    $: if (!$YDistributionFilter.min_yvalue.lock && $min_yvalue) $YDistributionFilter.min_yvalue.value = $min_yvalue;
    $: if (!$YDistributionFilter.max_yvalue.lock && $max_yvalue) $YDistributionFilter.max_yvalue.value = $max_yvalue;

    const ApplyFilterForYData = async () => {
        if ($filtered_dir !== 'default') {
            toast.error('Ydata filters can only be applied to the default file');
            return;
        }

        if ($YDistributionFilter.min_yvalue.lock && $YDistributionFilter.max_yvalue.lock) {
            toast.error('Please unlock and provide a value for min or max');
            return;
        }

        let miny = null;
        let maxy = null;

        if (!$YDistributionFilter.min_yvalue.lock) {
            miny = parseFloat($YDistributionFilter.min_yvalue.value ?? '');
        }

        if (!$YDistributionFilter.max_yvalue.lock) {
            maxy = parseFloat($YDistributionFilter.max_yvalue.value ?? '');
        }

        if (miny === null && maxy === null) {
            toast.error('Please provide a value for min or max');
            return;
        }

        saved_filter_filename = '';

        const args = {
            filename: $training_file.filename,
            filetype: $training_file.filetype,
            key: $training_file.key,
            use_dask: $use_dask,
            min_yvalue: miny,
            max_yvalue: maxy,
            property_column: $training_column_name_y,
        };
        const pyfile = 'load_file.apply_filter_for_ydata';
        return { pyfile, args };
    };

    let saved_filter_filename = '';
</script>

<h3>Filtering</h3>
<div class="flex gap-3 items-end">
    <CustomInput
        bind:value={$min_yvalue}
        label="Min value"
        enabled_lock_mode
        bind:lock={$YDistributionFilter.min_yvalue.lock}
    />
    <CustomInput
        bind:value={$max_yvalue}
        label="Max value"
        enabled_lock_mode
        bind:lock={$YDistributionFilter.max_yvalue.lock}
    />

    <Loadingbtn
        name="Apply Ydata filters"
        subprocess={true}
        callback={() => ApplyFilterForYData()}
        on:result={e => {
            console.warn(e.detail);
            saved_filter_filename = e.detail?.dataFromPython?.savefile;
        }}
    />
</div>

{#if saved_filter_filename}
    <Notification>
        <p class="text-sm">Ydata filters applied successfully</p>
        <p class="text-sm">Please browse and LOAD_DATA again for the saved file to continue.</p>
        <p class="text-sm">{saved_filter_filename}</p>
    </Notification>
{/if}
<div class="divider"></div>

<div class="grid grid-cols-3 max-w-6xl gap-[50px]">
    {#if data?.descriptive_statistics && data?.skewness && data?.kurtosis && data?.anderson_darling_test}
        <div class="grid gap-1" style="align-content: baseline;">
            <h3>Descriptive Statistics</h3>
            <p class="text-sm">
                These statistics provide a summary of the central tendency and dispersion of the molecular property data
            </p>
            <div class="divider"></div>

            <div class="grid grid-cols-2 gap-1">
                <p class="font-bold">Mean</p>
                <span>{data.descriptive_statistics.mean.toFixed(4)}</span>
                <p class="font-bold">Median</p>
                <span>{data.descriptive_statistics['50%'].toFixed(4)}</span>
                <p class="font-bold">Standard Deviation</p>
                <span>{data.descriptive_statistics.std.toFixed(4)}</span>
                <p class="font-bold">Minimum</p>
                <span>{data.descriptive_statistics.min.toFixed(4)}</span>
                <p class="font-bold">Maximum</p>
                <span>{data.descriptive_statistics.max.toFixed(4)}</span>
            </div>
            <div class="divider"></div>
            <div class="grid grid-cols-2">
                <p class="font-bold">Percentile</p>
                <p class="font-bold">Critical Value</p>
                <p>25% (Q1)</p>
                <span>{data.descriptive_statistics['25%'].toFixed(4)}</span>
                <p>50% (Median)</p>
                <span>{data.descriptive_statistics['50%'].toFixed(4)}</span>
                <p>75% (Q3)</p>
                <span>{data.descriptive_statistics['75%'].toFixed(4)}</span>
            </div>
            <p class="text-sm">
                Percentiles are useful for understanding the spread and skewness of the data. The range between the 25th
                and 75th percentiles (interquartile range) contains the middle 50% of the data and is resistant to
                outliers.
            </p>
        </div>
        <div class="grid gap-1" style="align-content: baseline;">
            <h3>Distribution Characteristics</h3>
            <p class="text-sm">These metrics provide information about the shape of the data distribution</p>
            <div class="divider"></div>
            <p class="font-bold">Skewness: {data.skewness.toFixed(4)}</p>
            <p class="text-sm">
                Skewness: Measures the asymmetry of the distribution. A positive value indicates a right-skewed
                distribution, while a negative value indicates a left-skewed distribution.
            </p>
            <p class="text-sm font-bold">Recommended Transformations:</p>
            {#if Math.abs(data.skewness) < 0.1}
                <span class="badge badge-success"> No transformation is needed </span>
            {:else if Math.abs(data.skewness) < 0.5}
                <span class="badge badge-info">The data is slightly skewed</span>
                <p class="text-sm">No transformation is needed.</p>
            {:else if Math.abs(data.skewness) < 1}
                <span class="badge badge-warning">The data is moderately skewed</span>
                <p class="text-sm">Square Root or Logarithmic Transformation</p>
            {:else}
                <span class="badge badge-error"> The data is highly skewed. </span>
                <p class="text-sm">Logarithmic, Reciprocal, or Box-Cox Transformation</p>
            {/if}
            <div class="divider"></div>
            <p class="font-bold">Kurtosis: {data.kurtosis.toFixed(4)}</p>

            <p class="text-sm">
                Kurtosis: Measures the "tailedness" of the distribution. A high value indicates heavy tails (more
                outliers), while a low value indicates light tails.
            </p>
        </div>
        <div class="grid gap-1" style="align-content: baseline;">
            <h3>Anderson-Darling Test</h3>
            <p class="text-sm">This test is used to determine if the data follows a normal distribution</p>
            <div class="divider"></div>
            <p class="font-bold">Statistic: {data.anderson_darling_test.statistic.toFixed(4)}</p>
            <p class="text-sm">
                Statistic: The test statistic. A smaller value suggests the data is closer to a normal distribution.
            </p>
            <div class="divider"></div>
            <div class="grid grid-cols-3 justify-items-start gap-1">
                <!-- <p class="font-bold">Significance Level</p> -->
                <p class="font-bold">Significance Level</p>
                <p class="font-bold">Critical Value</p>
                <p class="font-bold">Normal dist.</p>
                {#each data.anderson_darling_test.critical_values as cv, index (cv)}
                    {@const alpha = Number(data.anderson_darling_test.significance_levels?.[index])}
                    <p>{alpha}%</p>
                    <span>{cv.toFixed(4)}</span>
                    <!-- <span>{ ? ''}</span> -->
                    {#if data.anderson_darling_test.statistic > cv}
                        <span class="flex items-center gap-1"><CircleAlert /><span>No</span></span>
                    {:else}
                        <span class="flex items-center gap-1"><Check /><span>Yes</span></span>
                    {/if}
                {/each}
            </div>
            <p class="text-sm">
                Critical Values: These are thresholds for different significance levels. If the test statistic is
                greater than a critical value, it suggests the data is not normally distributed at that significance
                level.
            </p>

            <p class="text-sm font-bold">Scaling recommendation:</p>
            <ul>
                <li class="text-sm">
                    If test statistic {'<'} critical value: Data is likely normal, use <code>StandardScaler</code>
                </li>
                <li class="text-sm">
                    If test statistic {'>'} critical value: Data may not be normal, consider <code>RobustScaler</code>
                    transformations
                </li>
            </ul>
        </div>
    {/if}
</div>
<div class="divider"></div>
