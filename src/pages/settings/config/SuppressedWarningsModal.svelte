<script lang="ts">
    import Modal from '$lib/components/modal/Modal.svelte';
    import { suppressed_warnings } from '$lib/pyserver/stores';
    import { Trash2, AlertTriangle } from 'lucide-svelte/icons';
</script>

{#if $suppressed_warnings && Object.keys($suppressed_warnings).length > 0}
    <Modal title="Supressed warnings" label="Show Warnings" open={false}>
        <svelte:fragment let:openModal let:label slot="button-slot">
            <div class="indicator">
                <span class="indicator-item badge">{Object.keys($suppressed_warnings).length}</span>
                <button class="btn btn-sm btn-warning" on:click={openModal}>
                    <AlertTriangle size="18" />
                    <span>{label}</span>
                </button>
            </div>
        </svelte:fragment>

        <div class="flex w-full my-2">
            <button class="btn btn-sm btn-error m-auto" on:click={() => ($suppressed_warnings = {})}>
                <Trash2 size="20" />
                Dismiss all
            </button>
        </div>

        <div class="grid gap-2">
            {#each Object.keys($suppressed_warnings) as pyfile (pyfile)}
                <div class="grid gap-2">
                    <div class="collapse collapse-arrow bg-base-200" style="background-color: #d2ccd2;">
                        <input type="radio" name="my-accordion-1" checked={true} />
                        <div class="collapse-title text-xl font-medium">{pyfile}</div>
                        <div class="collapse-content">
                            <div class="flex w-full my-2">
                                <button
                                    class="btn btn-sm btn-error m-auto"
                                    on:click={() => {
                                        delete $suppressed_warnings[pyfile];
                                        $suppressed_warnings = $suppressed_warnings;
                                    }}
                                >
                                    <Trash2 size="20" />
                                    Dismiss all
                                </button>
                            </div>
                            <div class="grid gap-2">
                                {#each $suppressed_warnings[pyfile] as { timestamp, warnings, id } (id)}
                                    <div class="grid gap-2">
                                        <div class="collapse collapse-arrow bg-base-200">
                                            <input type="radio" name="my-accordion-2" checked={true} />
                                            <div class="collapse-title text-xl font-medium">{timestamp}</div>
                                            <div class="collapse-content">
                                                <button
                                                    class="m-auto btn btn-xs btn-error"
                                                    on:click={() => {
                                                        $suppressed_warnings[pyfile] = $suppressed_warnings[
                                                            pyfile
                                                        ].filter(w => w.id !== id);
                                                        if ($suppressed_warnings[pyfile].length === 0) {
                                                            delete $suppressed_warnings[pyfile];
                                                        }
                                                    }}
                                                >
                                                    <Trash2 size="12" />
                                                    <span>Dismiss</span>
                                                </button>
                                                <p class="text-sm font-400 select-text">
                                                    {#each warnings as w, ind}
                                                        {ind + 1}. {w}
                                                        {#if ind < warnings.length - 1}
                                                            <br />
                                                        {/if}
                                                    {/each}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </Modal>
{/if}
