<script>
    import Page from '$lib/layouts/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import { Configuration, Console, About, Update, ProcessManager } from '.';
</script>

<Page page_name="Settings" pane_size={20}>
    <svelte:fragment slot="body" let:active_children>
        <Pane minSize={50} maxSize={90}>
            <Configuration display={active_children === 'configuration' ? 'grid' : 'none'} />
            <Console display={active_children === 'console' ? 'grid' : 'none'} />
            <About display={active_children === 'about' ? 'grid' : 'none'} />
            <Update display={active_children === 'update' ? 'grid' : 'none'} />
            <ProcessManager display={active_children === 'process-monitor' ? 'grid' : 'none'} />
        </Pane>
    </svelte:fragment>
</Page>
