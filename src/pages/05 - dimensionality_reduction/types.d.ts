type DRNames =
    | 'PCA'
    | 'UMAP'
    | 't-SNE'
    | 'KernelPCA'
    | 'PHATE'
    | 'ISOMAP'
    | 'LaplacianEigenmaps'
    | 'TriMap'
    | 'FactorAnalysis';

interface UMAPParams {
    n_neighbors: number;
    min_dist: number;
    n_components: number;
    n_jobs: number;
    metric: string;
    random_state: number;
}

interface PCAParams {
    n_components: number;
    random_state: number;
}

interface KernelPCAParams {
    n_components: number;
    kernel: string;
    gamma: number | null;
}

interface TSNEParams {
    n_components: number;
    perplexity: number;
    random_state: number;
}

interface PHATEParams {
    n_components: number;
    knn: number;
    decay: number;
    t: string;
    random_state: number;
}

interface ISOMAPParams {
    n_components: number;
    n_neighbors: number;
}

interface LaplacianEigenmapsParams {
    n_components: number;
    n_neighbors: number;
}

interface TriMapParams {
    n_dims: number;
    n_inliers: number;
    n_outliers: number;
    n_random: number;
    distance: string;
}

interface FactorAnalysisParams {
    n_components: number;
}

type DRParamDescription<T> = {
    [K in keyof T]: { value: T[K]; description: string; type: string; options?: T[K][] };
};

type DRDefaultParams = {
    PCA: DRParamDescription<PCAParams>;
    UMAP: DRParamDescription<UMAPParams>;
    't-SNE': DRParamDescription<TSNEParams>;
    KernelPCA: DRParamDescription<KernelPCAParams>;
    PHATE: DRParamDescription<PHATEParams>;
    ISOMAP: DRParamDescription<ISOMAPParams>;
    LaplacianEigenmaps: DRParamDescription<LaplacianEigenmapsParams>;
    TriMap: DRParamDescription<TriMapParams>;
    FactorAnalysis: DRParamDescription<FactorAnalysisParams>;
};

interface UMAP_DBSCAN_Cluster_PARAMS {
    n_neighbors: number;
    min_dist: number;
    n_components: number;
    n_jobs: number;
    metric: string;
    random_state: number;
    scale_embedding: boolean;
    use_cleaned_data: boolean;
    annotate_clusters: boolean;
    dbscan_eps: number;
    dbscan_min_samples: number;
    random_state_locked: boolean;
    fig_title: string;
}
