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

export const loaded_files = writable<LoadedInfosFile>({});

export const dr_methods = ['PCA', 'UMAP', 't-SNE'] as const;
export const active_dr = writable<(typeof dr_methods)[number]>('PCA');
export const use_dr = writable(false);
