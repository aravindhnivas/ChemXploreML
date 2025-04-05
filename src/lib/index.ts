export const APP_IDS = {
    Home: {
        name: 'Home',
    },
    'Molecular Analysis': {
        name: 'Molecular Analysis',
    },
    'Train Embedder': {
        name: 'Train Embedder',
        children: [
            { name: 'Mol2Vec', id: 'Mol2Vec' },
            { name: 'VICGAE', id: 'VICGAE' },
            { name: 'PCA', id: 'PCA' },
        ],
    },
};
