<script>
    import { active_page_id } from '$pages/pages';
</script>

<div class="hero h-full" style:display={$active_page_id === 'home' ? '' : 'none'}>
    <div class="hero-content text-center">
        <div class="grid max-w-md gap-5 justify-items-center">
            <div class="animate__animated animate__fadeInDown">
                <img src="/icons/icon.png" alt="ChemXploreML Logo" class="w-32 h-32 m-auto" />
            </div>
            <div class="animate__animated animate__fadeInUp">
                <h1 class="text-5xl font-bold">ChemXploreML</h1>
                <p>A general-purpose desktop application for chemistry</p>
            </div>
            <div class="animate__animated animate__fadeInUp">
                <button
                    class="btn btn-sm btn-outline w-max"
                    on:click={() => {
                        logger.info('Get Started button clicked');
                    }}>Get Started</button
                >
            </div>
        </div>
    </div>
</div>
