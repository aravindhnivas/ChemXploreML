<script lang="ts">
    import FileLoader from '$lib/components/fileloader/FileLoader.svelte';

    const filename = localWritable('data_filename', '');
    let data: DataType | null = null;

    let filetype = 'smi';
    let key = 'data';
    let vector_size = 300;

    const generate_vec = async () => {
        toast.error('Under construction');
        return { pyfile: 'ml_training.vicgae', args: {} };

        if (!$filename) {
            toast.error('Please select a file');
            return;
        }

        return {
            pyfile: 'ml_training.vicgae',
            args: {
                smi_file: $filename,
                vector_size,
            },
        };
    };
</script>

<div class="grid content-start gap-2">
    <h2>VICGAE - embedder</h2>

    <h3>Load file containing SMILES</h3>
    <FileLoader bind:filename={$filename} bind:data bind:filetype bind:key filetypes={['smi']} />

    <h3>Generate a VICGAE embedder model</h3>
    <!-- under construction -->
    <p class="text-red-500">Under construction</p>
</div>
