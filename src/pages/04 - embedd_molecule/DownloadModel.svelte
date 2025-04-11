<script lang="ts">
    import { Download } from 'lucide-svelte/icons';
    import { embedding, embedding_file_download_url, embedder_model_filepath } from './stores';

    export let progress: number = 0;
    export let downloading: boolean = false;

    async function startDownload() {
        if (downloading) return;
        downloading = true;
        progress = 0;

        const embedding_models_dir = await path.join(await path.appLocalDataDir(), 'embedding_models');
        const model_file = await path.join(embedding_models_dir, $embedding + '.pkl');
        const cmd = shell.Command.create('curl', [
            '-L',
            $embedding_file_download_url[$embedding],
            `--output`,
            model_file,
            '--progress-bar',
            '--create-dirs',
            // '--output-dir',
            // embedding_models_dir,
        ]);

        const child = await cmd.spawn();

        console.warn('child', child);

        cmd.stdout.on('data', data => {
            console.log(`stdout: ${data}`);
        });

        cmd.stderr.on('data', data => {
            console.warn(data);
            const _progress = data.match(/(\d+.\d+)%/);
            if (_progress?.[0]) {
                progress = parseFloat(_progress[1]);
                if (progress >= 100) {
                    downloading = false;
                    $embedder_model_filepath[$embedding] = model_file;
                    console.log('Download complete');
                }
            }
        });

        cmd.on('close', async code => {
            console.log(`child process exited with code ${code}`);
            downloading = false;
            progress = 0;
        });

        cmd.on('error', error => {
            console.error(`error: ${error}`);
        });
    }
</script>

<div class="flex flex-col items-center gap-4">
    <button class="btn btn-primary" on:click={startDownload} disabled={downloading}>
        {#if downloading}
            <span class="loading loading-spinner loading-sm"></span>
            Downloading...
        {:else}
            <Download />
            <span>Download - {$embedding} model</span>
        {/if}
    </button>

    {#if downloading}
        <progress class="progress progress-primary w-56" value={progress} max="100"></progress>
    {/if}
</div>
