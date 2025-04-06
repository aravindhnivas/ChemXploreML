interface Exposed {
    sleep: (ms: number) => Promise<void>;
    getID: () => string;
}

interface Window extends Exposed {}

interface OutputBoxtype {
    value: string;
    type: 'info' | 'error' | 'warning' | 'success';
}

type PAGES = 'Home' | 'MolecularAnalysis' | 'MolecularEmbedder' | 'Training' | 'UMAP' | 'Settings';
type AppIds = Record<
    PAGES,
    {
        name: string;
        icon: any;
        id: string;
        children?: {
            name: string;
            id: string;
            icon?: any;
        }[];
    }
>;
