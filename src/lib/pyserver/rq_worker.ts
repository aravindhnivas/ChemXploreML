import { redis_worker_log } from '$lib/start_stop_server/index';
import * as shell from '@tauri-apps/plugin-shell';
import { get, writable } from 'svelte/store';

export const rqWorkerChild = writable<shell.Child | null>(null); // To store the child process instance

export async function startRqWorker() {
    try {
        // Stop any existing worker first
        await stopRqWorker();

        // Create a new command instance for 'rq worker --name cxml'
        const command = shell.Command.create('rq', ['worker', '--name', 'cxml']);

        // Listen for stdout and stderr events (optional, but good for debugging)
        command.stdout.on('data', data => {
            redis_worker_log.info(`rq worker stdout: ${data}`);
            // You can update your UI with this output
        });

        command.stderr.on('data', data => {
            redis_worker_log.error(`rq worker stderr: ${data}`);
            // You can update your UI with this error
        });

        // Listen for the process to close
        command.on('close', event => {
            redis_worker_log.warn(`rq worker closed with code ${event.code} and signal ${event.signal}`);
            rqWorkerChild.set(null); // Clear the child reference
            // Update UI to show that the worker has stopped
        });

        command.on('error', error => {
            redis_worker_log.error(`Failed to start rq worker: ${error}`);
            rqWorkerChild.set(null); // Clear the child reference on error
            // Update UI to show the error
        });

        // Spawn the child process
        rqWorkerChild.set(await command.spawn());
        redis_worker_log.info(`rq worker started with PID: ${get(rqWorkerChild)?.pid}`);
        // Update UI to show that the worker is running
    } catch (error) {
        redis_worker_log.error(`Error starting rq worker: ${error}`);
    }
}

export async function stopRqWorker() {
    if (get(rqWorkerChild)) {
        try {
            // Kill the child process
            await get(rqWorkerChild)?.kill();
            redis_worker_log.info(`rq worker with PID ${get(rqWorkerChild)?.pid} stopped.`);
            rqWorkerChild.set(null);
            // Update UI to show that the worker has stopped
        } catch (error) {
            redis_worker_log.error(`Error stopping rq worker: ${error}`);
        }
    } else {
        redis_worker_log.info('rq worker is not running.');
    }
}
