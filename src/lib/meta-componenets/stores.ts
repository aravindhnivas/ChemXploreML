export const loaded_files = writable<LoadedInfosFile>({
    training_file: { value: '', valid: false, basename: '' },
    embedded_file: { value: '', valid: false, basename: '' },
    columnX: { value: '', valid: false, basename: '' },
    columnY: { value: '', valid: false, basename: '' },
    final_processed_file: { value: '', valid: false, basename: '' },
});

export const all_files_loaded = writable(false);
