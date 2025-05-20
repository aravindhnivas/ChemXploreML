import type { RDKitModule, JSMol } from './rdkit';

interface Exposed {
    sleep: (ms: number) => Promise<void>;
    getID: () => string;
    RDKit: RDKitModule;
    JSMol: JSMol;
}

declare global {
    interface Window extends Exposed {}

    interface OutputBoxtype {
        value: string;
        type: 'info' | 'error' | 'warning' | 'success';
    }

    type PAGES =
        | 'Home'
        | 'MolecularAnalysis'
        | 'LoadFile'
        | 'EmbeddMolecule'
        | 'DimenstionalityReduction'
        | 'MLTraining'
        | 'Settings';

    interface NavigationChild {
        name: string;
        id: string;
        icon?: typeof SvelteComponent; // optional icon for children
        title: string;
        description: string;
    }

    // Define a robust type for top-level navigation pages
    interface NavigationPage {
        name: string;
        id: string;
        icon: typeof SvelteComponent; // required icon for main pages
        title: string;
        description: string;
        children: NavigationChild[]; // each page has an array of child items
    }

    type NavigationConfig = Record<PAGES, NavigationPage>;
}
