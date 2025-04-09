interface Exposed {
    sleep: (ms: number) => Promise<void>;
    getID: () => string;
}
interface Window extends Exposed {}

interface OutputBoxtype {
    value: string;
    type: 'info' | 'error' | 'warning' | 'success';
}

// type PAGES = 'Home' | 'MolecularAnalysis' | 'MolecularEmbedder' | 'Training' | 'UMAP' | 'Settings';
//
type PAGES =
    | 'Home'
    | 'MolecularAnalysis'
    | 'LoadFile'
    | 'EmbeddMolecule'
    | 'DimenstionalityReduction'
    | 'MLTraining'
    | 'Settings';

type AppIds = Record<
    PAGES,
    {
        name: string;
        icon: any;
        id: string;
        title: string;
        description: string;
        children: {
            name: string;
            id: string;
            icon?: any;
            title: string;
            description: string;
        }[];
    }
>;
type AppDescription = Record<
    PAGES,
    {
        title: string;
        description: string;
        children: {
            title: string;
            description: string;
        }[];
    }
>;
