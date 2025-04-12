<script lang="ts">
    import { dr_methods, active_dr, use_dr } from './stores';
    import Radio from '@smui/radio';

    import { current_embedder_model_filepath, embedd_savefile_path } from '$pages/04 - embedd_molecule/stores';
    import Checkbox from '$lib/components/Checkbox.svelte';
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
            <tr>
                <td>PCA</td>
                <td>Linear projection capturing directions of maximum variance.</td>
                <td>⚠️ Moderate</td>
                <td>✅ Excellent</td>
                <td>✅ Fast</td>
            </tr>
            <tr>
                <td>KernelPCA</td>
                <td>Nonlinear PCA using RBF or polynomial kernels.</td>
                <td>✅ Good</td>
                <td>✅ Good</td>
                <td>⚠️ Slower</td>
            </tr>
            <tr>
                <td>t-SNE</td>
                <td>Preserves local clusters using stochastic modeling.</td>
                <td>✅ Excellent</td>
                <td>❌ Poor</td>
                <td>❌ Slow</td>
            </tr>
            <tr>
                <td>UMAP</td>
                <td>Topological embedding preserving local and mid-range patterns.</td>
                <td>✅ Excellent</td>
                <td>⚠️ Moderate</td>
                <td>✅ Fast</td>
            </tr>
            <tr>
                <td>PHATE</td>
                <td>Diffusion-based method for visualizing progression or trajectories.</td>
                <td>✅ Good</td>
                <td>✅ Excellent</td>
                <td>⚠️ Medium</td>
            </tr>
            <tr>
                <td>ISOMAP</td>
                <td>Preserves geodesic distances in nonlinear manifolds.</td>
                <td>✅ Excellent</td>
                <td>✅ Good</td>
                <td>⚠️ Medium</td>
            </tr>
            <tr>
                <td>Laplacian Eigenmaps</td>
                <td>Spectral method preserving local manifold information.</td>
                <td>✅ Excellent</td>
                <td>❌ Poor</td>
                <td>✅ Fast</td>
            </tr>
            <tr>
                <td>TriMap</td>
                <td>Triplet-based approach focusing on global structure.</td>
                <td>✅ Excellent</td>
                <td>✅ Good</td>
                <td>✅ Fast</td>
            </tr>
            <tr>
                <td>Factor Analysis</td>
                <td>Statistical method uncovering latent factors.</td>
                <td>⚠️ Limited</td>
                <td>✅ Good</td>
                <td>✅ Fast</td>
            </tr>
        </tbody>
    </table>
</div>
