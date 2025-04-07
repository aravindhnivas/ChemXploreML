<script>
    import Page from '$lib/layouts/Page.svelte';
    import { Pane } from 'svelte-splitpanes';
    import { Configuration, Console, System, Update, ProcessManager, Credit } from '.';
</script>

<Page page_name="Settings" pane_size={20}>
    <svelte:fragment slot="body" let:active_children>
        <Pane minSize={50} maxSize={90}>
            <Configuration display={active_children === 'configuration' ? 'grid' : 'none'} />
            <Console display={active_children === 'console' ? 'grid' : 'none'} />
            <System display={active_children === 'system' ? 'grid' : 'none'} />
            <Update display={active_children === 'update' ? 'grid' : 'none'} />
            <ProcessManager display={active_children === 'process-monitor' ? 'grid' : 'none'} />
            <Credit display={active_children === 'credit' ? 'grid' : 'none'} />
        </Pane>
    </svelte:fragment>
</Page>
