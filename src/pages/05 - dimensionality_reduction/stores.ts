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

export const dr_methods = [
    'PCA',
    'UMAP',
    't-SNE',
    'KernelPCA',
    'PHATE',
    'ISOMAP',
    'LaplacianEigenmaps',
    'TriMap',
    'FactorAnalysis',
] as const;
export const active_dr = writable<(typeof dr_methods)[number]>('PCA');
export const use_dr = writable(false);

export const dr_params_filename = localWritable<Record<DRNames, string>>('dr_params_filename', {
    UMAP: 'default',
    PCA: 'default',
    't-SNE': 'default',
    KernelPCA: 'default',
    PHATE: 'default',
    ISOMAP: 'default',
    LaplacianEigenmaps: 'default',
    TriMap: 'default',
    FactorAnalysis: 'default',
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
    KernelPCA: '',
    PHATE: '',
    ISOMAP: '',
    LaplacianEigenmaps: '',
    TriMap: '',
    FactorAnalysis: '',
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

    KernelPCA: {
        n_components: {
            value: 2,
            type: 'number',
            description: 'Number of components to keep.',
        },
        kernel: {
            value: 'rbf',
            type: 'string',
            description: 'Kernel to use in the algorithm.',
            options: ['linear', 'poly', 'rbf', 'sigmoid', 'cosine'],
        },
        gamma: {
            value: null,
            type: 'number',
            description: 'Kernel coefficient for rbf, poly and sigmoid.',
        },
    },

    PHATE: {
        n_components: {
            value: 2,
            type: 'number',
            description: 'Number of dimensions to reduce to.',
        },
        knn: {
            value: 5,
            type: 'number',
            description: 'Number of nearest neighbors to consider for PHATE graph construction.',
        },
        decay: {
            value: 40,
            type: 'number',
            description: 'Controls the exponential kernel decay; higher means broader influence.',
        },
        t: {
            value: 'auto',
            type: 'string',
            description: 'Diffusion time scale. "auto" selects optimal based on data entropy.',
        },
        random_state: {
            value: 42,
            type: 'number',
            description: 'Seed for reproducibility.',
        },
    },

    ISOMAP: {
        n_components: {
            value: 2,
            type: 'number',
            description: 'Number of coordinates for the manifold.',
        },
        n_neighbors: {
            value: 5,
            type: 'number',
            description: 'Number of neighbors considered for each point.',
        },
    },

    LaplacianEigenmaps: {
        n_components: {
            value: 2,
            type: 'number',
            description: 'Dimension of the embedding space.',
        },
        n_neighbors: {
            value: 10,
            type: 'number',
            description: 'Size of neighborhood graph for constructing the Laplacian.',
        },
    },

    TriMap: {
        n_dims: {
            value: 2,
            type: 'number',
            description: 'Output dimensionality.',
        },
        n_inliers: {
            value: 10,
            type: 'number',
            description: 'Number of inlier points used per triplet.',
        },
        n_outliers: {
            value: 5,
            type: 'number',
            description: 'Number of outlier points used per triplet.',
        },
        n_random: {
            value: 5,
            type: 'number',
            description: 'Number of random triplets per point.',
        },
        distance: {
            value: 'euclidean',
            type: 'string',
            description: 'Distance metric to use.',
            options: ['euclidean', 'manhattan', 'cosine'],
        },
    },

    FactorAnalysis: {
        n_components: {
            value: 2,
            type: 'number',
            description: 'Number of latent factors to extract.',
        },
    },
};

export const dr_methods_details: {
    method: DRNames;
    description: string;
    local: string;
    global: string;
    scalability: string;
}[] = [
    {
        method: 'PCA',
        description: 'Linear projection capturing directions of maximum variance.',
        local: '⚠️ Moderate',
        global: '✅ Excellent',
        scalability: '✅ Fast',
    },
    {
        method: 'KernelPCA',
        description: 'Nonlinear PCA using RBF or polynomial kernels.',
        local: '✅ Good',
        global: '✅ Good',
        scalability: '⚠️ Slower',
    },
    {
        method: 't-SNE',
        description: 'Preserves local clusters using stochastic modeling.',
        local: '✅ Excellent',
        global: '❌ Poor',
        scalability: '❌ Slow',
    },
    {
        method: 'UMAP',
        description: 'Topological embedding preserving local and mid-range patterns.',
        local: '✅ Excellent',
        global: '⚠️ Moderate',
        scalability: '✅ Fast',
    },
    {
        method: 'PHATE',
        description: 'Diffusion-based method for visualizing progression or trajectories.',
        local: '✅ Good',
        global: '✅ Excellent',
        scalability: '⚠️ Medium',
    },
    {
        method: 'ISOMAP',
        description: 'Preserves geodesic distances in nonlinear manifolds.',
        local: '✅ Excellent',
        global: '✅ Good',
        scalability: '⚠️ Medium',
    },
    {
        method: 'LaplacianEigenmaps',
        description: 'Spectral method preserving local manifold information.',
        local: '✅ Excellent',
        global: '❌ Poor',
        scalability: '✅ Fast',
    },
    {
        method: 'TriMap',
        description: 'Triplet-based approach focusing on global structure.',
        local: '✅ Excellent',
        global: '✅ Good',
        scalability: '✅ Fast',
    },
    {
        method: 'FactorAnalysis',
        description: 'Statistical method uncovering latent factors.',
        local: '⚠️ Limited',
        global: '✅ Good',
        scalability: '✅ Fast',
    },
];
