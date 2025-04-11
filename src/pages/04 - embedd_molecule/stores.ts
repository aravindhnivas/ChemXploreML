import { current_training_processed_data_directory } from '$pages/03 - load_file/plot-analysis/stores';
import { use_dr, active_dr } from '$pages/05 - dimensionality_reduction/stores';

export const embeddings_computed = writable(false);
export const embeddings = ['mol2vec', 'VICGAE'];
export const embedding = localWritable<Embedding>('embedding', 'mol2vec');
export const embedder_model_filepath = writable<Record<Embedding, string>>({
    mol2vec: '',
    VICGAE: '',
});
export const current_embedder_model_filepath = derived(
    [embedding, embedder_model_filepath],
    ([$embedding, $embedder_model_filepath]) => {
        return $embedder_model_filepath[$embedding];
    },
);

// export const embedd_savefile = writable<string>('');
export const embedd_savefile = derived([embedding, use_dr, active_dr], ([$embedding, $use_dr, $active_dr]) => {
    return `${$embedding}_embeddings` + ($use_dr ? `_${$active_dr}` : '');
});

export const embedd_savefile_path = derived(
    [embedd_savefile, current_training_processed_data_directory],
    async ([$embedd_savefile, $current_training_processed_data_directory]) => {
        const training_dirname = await $current_training_processed_data_directory;
        const final_dirname = await path.join(training_dirname, 'embedded_vectors');
        const savefile = await path.join(final_dirname, `${$embedd_savefile}.npy`);
        return savefile;
    },
);

export const processed_df = derived(
    [embedd_savefile, current_training_processed_data_directory],
    async ([$embedd_savefile, $current_training_processed_data_directory]) => {
        const training_dirname = await $current_training_processed_data_directory;
        const final_processed_file = await path.join(
            training_dirname,
            'embedded_vectors',
            `processed_${$embedd_savefile}`,
            'processed_df.parquet',
        );
        return final_processed_file;
    },
);

export const embedding_file_download_url = writable<Record<Embedding, string>>({
    mol2vec: 'https://drive.google.com/uc?export=download&id=1Tx12wmiNdFHKGe3uSJn6IPwCnx18eE6O',
    VICGAE: 'https://drive.google.com/uc?export=download&id=17peb0K6tGP0HbLG83I41ZJ1-wYVjEvmm',
});
