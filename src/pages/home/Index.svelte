<script>
    import Page from '$lib/layouts/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
</script>

<Page id="Home">
    <svelte:fragment slot="body">
        <Pane class="p-2">
            <div class="hero h-full">
                <div class="hero-content text-center">
                    <div class="max-w-md">
                        <h1 class="text-5xl font-bold">ChemXploreML</h1>
                        <p class="py-6">A general-purpose desktop application for molecular property prediction</p>
                        <button
                            class="btn btn-sm btn-outline"
                            on:click={() => {
                                logger.info('Get Started button clicked');
                            }}>Get Started</button
                        >
                    </div>
                </div>
            </div>
        </Pane>
    </svelte:fragment>
</Page>
