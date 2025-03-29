<script>
    import Page from '$lib/layouts/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
</script>

<Page id="Home">
    <svelte:fragment slot="body">
        <Pane class="p-2">
            <div class="hero h-full">
                <div class="hero-content text-center">
                    <div class="grid max-w-md gap-5 justify-items-center">
                        <img src="/icons/icon.png" alt="ChemXploreML Logo" class="w-32 h-32 m-auto" />

                        <h1 class="text-5xl font-bold">ChemXploreML</h1>
                        <p>A general-purpose desktop application for chemistry</p>
                        <button
                            class="btn btn-sm btn-outline w-max"
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
