export const umap_metrics = [
    'euclidean',
    'manhattan',
    'chebyshev',
    'minkowski',
    'canberra',
    'braycurtis',
    'mahalanobis',
    'wminkowski',
    'seuclidean',
    'cosine',
    'correlation',
    'haversine',
    'hamming',
    'jaccard',
    'dice',
    'russelrao',
    'kulsinski',
    'll_dirichlet',
    'hellinger',
    'rogerstanimoto',
    'sokalmichener',
    'sokalsneath',
    'yule',
];

export type UMAPMetric = (typeof umap_metrics)[number];

export const dr_methods = ['PCA', 'UMAP', 't-SNE'] as const;
export const active_dr = writable<(typeof dr_methods)[number]>('PCA');
export const use_dr = writable(false);

export const dr_params_filename = localWritable<Record<DRNames, string>>('dr_params_filename', {
    UMAP: 'default',
    PCA: 'default',
    't-SNE': 'default',
});

export const append_dr_name = derived(
    [use_dr, active_dr, dr_params_filename],
    ([$use_dr, $active_dr, $dr_params_filename]) => {
        if (!$use_dr) return '';
        return `${$active_dr}_${$dr_params_filename[$active_dr]}`;
    },
);

// export const dr_vector_file = localWritable<Record<DRNames, string>>('dr_vector_file', {
export const dr_vector_file = writable<Record<DRNames, string>>({
    UMAP: '',
    PCA: '',
    't-SNE': '',
});

export const DR_default_params: DRDefaultParams = {
    UMAP: {
        n_neighbors: {
            value: 15,
            type: 'number',
            description:
                'This parameter controls how UMAP balances local versus global structure in the data. Lower values will force UMAP to concentrate on very local structure (potentially to the detriment of the big picture), while larger values will push UMAP to look at larger neighborhoods of each point when making embeddings.',
        },
        min_dist: {
            value: 0.1,
            type: 'number',
            description:
                'The effective minimum distance between embedded points. Smaller values will result in a more clustered embedding. Higher values will force the embedded data to be more evenly distributed.',
        },
        n_components: { value: 2, type: 'number', description: 'The dimension of the space to embed into.' },
        n_jobs: {
            value: -1,
            type: 'number',
            description: 'The number of parallel jobs to run for neighbors search. -1 means using all processors.',
        },
        metric: {
            value: 'euclidean',
            type: 'string',
            description: 'The metric to use when calculating distance between instances in a feature array.',
            options: umap_metrics,
        },
        random_state: {
            value: 42,
            type: 'number',
            description:
                'The seed used by the random number generator. If random_state is used, n_jobs will be ignored.',
        },
    },
    PCA: {
        n_components: { value: 2, type: 'number', description: 'The dimension of the space to embed into.' },
        random_state: {
            value: 42,
            type: 'number',
            description:
                'The seed used by the random number generator. If random_state is used, n_jobs will be ignored.',
        },
    },
    't-SNE': {
        n_components: { value: 2, type: 'number', description: 'The dimension of the space to embed into.' },
        perplexity: {
            value: 30,
            type: 'number',
            description:
                'The perplexity is related to the number of nearest neighbors that is used in other manifold learning algorithms.',
        },
        random_state: {
            value: 42,
            type: 'number',
            description:
                'The seed used by the random number generator. If random_state is used, n_jobs will be ignored.',
        },
    },
};
