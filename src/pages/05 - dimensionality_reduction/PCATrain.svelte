<script lang="ts">
    import {
        current_embedder_model_filepath,
        embedd_savefile,
        embedd_savefile_path,
    } from '$pages/04 - embedd_molecule/stores';
    import BrowseFile from '$lib/components/BrowseFile.svelte';
    import Loadingbtn from '$lib/components/Loadingbtn.svelte';
    import { embeddings } from '$pages/04 - embedd_molecule/stores';
    import Plot from 'svelte-plotly.js';
    import CustomTabs from '$lib/components/CustomTabs.svelte';
    import { Binary, ChartCandlestick } from 'lucide-svelte/icons';
    import CustomInput from '$lib/components/CustomInput.svelte';
    let explained_variance_data: { x: number[]; y: number[] }[] = [];
    let cumulative_variance_data: { x: number[]; y: number[] }[] = [];

    const explained_variance_file = localWritable('pca-explained-variance-file', '');

    const read_file = async (filename: string) => {
        const explained_varience_read = (await fs.readTextFile(filename)) as string;
        const explained_varience = explained_varience_read
            .split('\n')
            .map(x => parseFloat(x))
            .filter(x => x);
        let cumulative_variance: number[] = [];
        explained_varience.forEach((x, i) => {
            if (i === 0) {
                cumulative_variance.push(x);
            } else {
                cumulative_variance.push(cumulative_variance[i - 1] + x);
            }
        });
        console.warn('File read', { explained_varience, cumulative_variance });
        explained_variance_data = [
            {
                x: Array.from({ length: explained_varience.length }, (_, i) => i + 1),
                y: explained_varience,
            },
        ];
        cumulative_variance_data = [
            {
                x: Array.from({ length: explained_varience.length }, (_, i) => i + 1),
                y: cumulative_variance,
            },
        ];
    };

    // read_file().then(() => console.log('done'));
    const active = localWritable('pca-active-tab', 'Training');
    const embeddings_save_loc = localWritable('pca_embeddings_save_loc', '');
    // const embedding_pipeline_loc = localWritable('pca_embedding_pipeline_loc', '');

    let radius = 1;
    let pca_dim = 70;
    let n_clusters = 20;
    // let use_embedding_pipeline = false;
    let compute_kmeans = false;
    let original_model = embeddings[0];

    const generate_pca = async () => {
        if (!$current_embedder_model_filepath) {
            toast.error('Please select a model_file');
            return;
        }

        const npy_file = await $embedd_savefile_path;
        if (!(await fs.exists(npy_file))) {
            toast.error('Please select a .npy vectors file');
            return;
        }

        // if (!$embeddings_save_loc) {
        //     toast.error('Please select a embeddings save location');
        //     return;
        // }

        return {
            pyfile: 'training.pca',
            args: {
                pca_dim,
                n_clusters,
                radius,
                embeddings_save_loc: $embeddings_save_loc,
                model_file: $current_embedder_model_filepath,
                npy_file: npy_file,
                compute_kmeans,
                original_model,
            },
        };
    };

    // $:
</script>

<CustomTabs
    class="bordered"
    tabs={[
        { tab: 'Training', component: Binary },
        { tab: 'Analysis', component: ChartCandlestick },
    ]}
    bind:active={$active}
/>

{#if $active === 'Training'}
    <div class="flex gap-1 items-center">
        <CustomInput bind:value={radius} label="radius" type="number" helper="Radius of morgan fingerprint" />
        <CustomInput bind:value={pca_dim} label="pca_dim" type="number" helper="PCA dimensions" />
        <Loadingbtn callback={generate_pca} subprocess={true} />
    </div>
{:else if $active === 'Analysis'}
    <BrowseFile bind:filename={$explained_variance_file} btn_name={'Browse explained_variance'} callback={read_file} />
    <div class="plot__div">
        <div class="grid">
            <h2>Scree plot</h2>
            <div style="height: 500px;">
                <Plot
                    data={explained_variance_data}
                    layout={{
                        xaxis: { title: 'Number of components' },
                        yaxis: { title: 'Explained variance' },
                        margin: { t: 0 },
                    }}
                    fillParent={true}
                    debounce={250}
                />
            </div>
        </div>

        <div class="grid">
            <!-- {cumulative_variance_data[0]} -->
            <h2>
                Cumulative explained variance ({cumulative_variance_data[0]
                    ? Number(cumulative_variance_data[0].y.at(-1) * 100).toFixed(0)
                    : ''} %)
            </h2>
            <div style="height: 500px;">
                <Plot
                    data={cumulative_variance_data}
                    layout={{
                        xaxis: { title: 'Number of components' },
                        yaxis: { title: 'Cumulative explained variance' },
                        margin: { t: 0 },
                    }}
                    fillParent={true}
                    debounce={250}
                />
            </div>
        </div>
    </div>
{/if}

<style>
    .plot__div {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(700px, 1fr));
        margin-top: 1rem;
    }
</style>
