<script lang="ts">
    import { dr_methods, active_dr, use_dr, dr_methods_details } from './stores';
    import Checkbox from '$lib/components/Checkbox.svelte';
    import Radio from '@smui/radio';
</script>

<Checkbox bind:value={$use_dr} label="use DR" />

<div class="flex flex-wrap">
    {#each dr_methods as option}
        <div class="flex items-center flex-wrap">
            <Radio bind:group={$active_dr} value={option} touch />
            <pre>{option}</pre>
        </div>
    {/each}
</div>
<div class="overflow-x-auto">
    <table class="table bg-base-200 table-sm text-sm">
        <thead>
            <tr>
                <th>Method</th>
                <th>Description</th>
                <th>Local Structure</th>
                <th>Global Structure</th>
                <th>Scalability</th>
            </tr>
        </thead>
        <tbody>
            {#each dr_methods_details as item}
                <tr>
                    <td>{item.method}</td>
                    <td>{item.description}</td>
                    <td>{item.local}</td>
                    <td>{item.global}</td>
                    <td>{item.scalability}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
