interface DataType {
    columns: string[];
    head: {
        [key: string]: string | number;
    }[];
    shape: number;
    index_name: string;
}

interface EmbeddingResult {
    name: string;
    shape: string;
    invalid_smiles: string[];
    saved_file: string;
    computed_time: string;
}

type Embedding = 'mol2vec' | 'VICGAE';
// training_file: { value: '', valid: false, basename: '' },
//                 embedded_file: { value: '', valid: false, basename: '' },
//                 columnX: { value: '', valid: false, basename: '' },
//                 columnY: { value: '', valid: false, basename: '' },
//                 final_processed_file: { value: '', valid: false, basename: '' },

type LoadedFileNames = 'training_file' | 'embedded_file' | 'columnX' | 'columnY' | 'final_processed_file';
type LoadedInfosFile = Record<LoadedFileNames, { value: string; valid: boolean; basename: string }>;

interface EmbeddingState {
    test_mode?: { embedded_vector: number[] };
    file_mode?: {
        name: string;
        shape: number;
        invalid_smiles: string[];
        saved_file: string;
        computed_time: string;
    };
    computed_time: string;
}
