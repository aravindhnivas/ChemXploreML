type DRNames = 'PCA' | 'UMAP' | 't-SNE';
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

interface TSNEParams {
    n_components: number;
    perplexity: number;
    random_state: number;
}

type DRParamDescription<T> = {
    [K in keyof T]: { value: T[K]; description: string; options?: T[K][] };
};

type DRDefaultParams = {
    PCA: DRParamDescription<PCAParams>;
    UMAP: DRParamDescription<UMAPParams>;
    't-SNE': DRParamDescription<TSNEParams>;
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
