import {
    Home,
    Settings,
    Binary,
    Atom,
    Bot,
    Layers2,
    MonitorDown,
    Wand,
    HardDriveDownload,
    Terminal,
    MonitorCheck,
    WalletCards,
    Info,
    Scale,
    FileText,
    ChartBar,
} from 'lucide-svelte/icons';

export const APP_IDS = writable<AppIds>({
    Home: {
        name: 'Home',
        icon: Home,
        id: 'home',
    },
    MolecularAnalysis: {
        name: 'Molecule Analysis',
        icon: Atom,
        id: 'molecular_analysis',
    },
    // MolecularEmbedder: {
    //     name: 'Train Embedder',
    //     icon: Bot,
    //     id: 'molecular_embedder',
    //     children: [
    //         { name: 'Mol2Vec', id: 'Mol2Vec' },
    //         { name: 'VICGAE', id: 'VICGAE' },
    //         { name: 'PCA', id: 'PCA' },
    //     ],
    // },
    // Training: {
    //     name: 'ML Training',
    //     icon: Binary,
    //     id: 'ml_training',
    //     children: [
    //         { name: 'Load file', id: 'load_file', icon: MonitorDown },
    //         { name: 'Embedding', id: 'embedding', icon: Bot },
    //         { name: 'ML Model', id: 'ml_model', icon: Binary },
    //         { name: 'ML Prediction', id: 'ml_prediction', icon: Wand },
    //     ],
    // },
    // UMAP: {
    //     name: 'UMAP/t-SNE',
    //     icon: Layers2,
    //     id: 'umap_tsne',
    //     children: [
    //         { name: 'Meta Infos', id: 'meta_infos' },
    //         { name: 'UMAP', id: 'umap_embedder' },
    //         { name: 't-SNE', id: 'tsne_embedder' },
    //     ],
    // },
    LoadFile: {
        name: 'Load File',
        icon: MonitorDown,
        id: 'load_file',
        children: [
            { name: 'Load', id: 'load_data', icon: FileText },
            { name: 'Analyse', id: 'analyse_data', icon: ChartBar },
        ],
    },
    EmbeddMolecule: {
        name: 'Embedd Molecule',
        icon: Bot,
        id: 'embedd_molecules',
    },
    DimenstionalityReduction: {
        name: 'Dimensionality Reduction',
        icon: Layers2,
        id: 'dim_reduction',
        children: [
            { name: 'PCA', id: 'pca_embedder' },
            { name: 'UMAP', id: 'umap_embedder' },
            { name: 't-SNE', id: 'tsne_embedder' },
        ],
    },
    MLTraining: {
        name: 'ML Training',
        icon: Binary,
        id: 'ml_training',
        children: [
            // { name: 'Load file', id: 'load_file', icon: MonitorDown },
            // { name: 'Embedding', id: 'embedding', icon: Bot },
            { name: 'ML Model', id: 'ml_model', icon: Binary },
            { name: 'ML Prediction', id: 'ml_prediction', icon: Wand },
        ],
    },
    Settings: {
        name: 'Settings',
        icon: Settings,
        id: 'settings',
        children: [
            { name: 'Configuration', id: 'configuration', icon: Settings },
            { name: 'Update', id: 'update', icon: HardDriveDownload },
            { name: 'Console', id: 'console', icon: Terminal },
            { name: 'Process-Monitor', id: 'process-monitor', icon: MonitorCheck },
            { name: 'System', id: 'system', icon: Info },
            { name: 'Credit', id: 'credit', icon: WalletCards },
            { name: 'License', id: 'license', icon: Scale },
        ],
    },
});

export const active_page_id = localWritable<string>('active_page_id', 'home');

export const active_page_child_id = localWritable<{ [key in PAGES]: string }>('active_page_child_id', {
    Home: '',
    MolecularAnalysis: '',
    // MolecularEmbedder: 'Mol2Vec',
    // Training: 'load_file',
    // UMAP: 'UMAP',
    LoadFile: 'load_data',
    EmbeddMolecule: '',
    DimenstionalityReduction: 'pca_embedder',
    MLTraining: 'ml_model',
    Settings: 'configuration',
});
