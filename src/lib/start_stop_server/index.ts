import { developerMode, pyProgram, pythonscript } from '$lib/pyserver/stores';
import { logger_store } from '$pages/settings/utils/stores';
import { Alert } from '$utils/stores';
import type { Child } from '@tauri-apps/plugin-shell';

export const redis_worker_log = logger_store('Terminal console initialized', 1000);
const server_started_keyword = 'Redis worker running';
const server_stopped_keyword = 'Redis worker stopped';

export const genericStartServer = async (btn: HTMLButtonElement, pyfile: string, args: Record<string, any>) => {
    const sendArgs = [pyfile, JSON.stringify(args)];
    const mainPyFile = await path.join(get(pythonscript), 'main.py');

    const pyArgs = get(developerMode) ? [mainPyFile, ...sendArgs] : sendArgs;
    console.log('pyProgram: ', get(pyProgram), 'pyArgs: ', pyArgs);
    let py;

    try {
        py = shell.Command.create(get(pyProgram), pyArgs);
    } catch (error) {
        console.error(error);
        Alert.error(error);
        return Promise.reject(error);
    }

    const [err, pyChild] = await oO<Child, string>(py.spawn());

    if (err) {
        toast.error(err);
        return Promise.reject(err);
    }

    if (!pyChild) return Promise.reject('pyChild not found');
    console.log(`pid: ${pyChild.pid}`);
    btn_dispatch_event(btn, { py, pyfile, pyChild }, 'mount');

    let full_stderr = '';

    py.stderr.on('data', async stderr => {
        if (!stderr.trim()) return;
        full_stderr += stderr;
        redis_worker_log.warn(stderr.trim());
        if (stderr.includes(server_started_keyword)) {
            btn_dispatch_event(btn, { py, pyfile, pyChild }, 'start');
        }
        if (stderr.includes(server_stopped_keyword)) {
            btn_dispatch_event(btn, { py, pyfile, pyChild }, 'stop');
        }
    });

    py.stdout.on('data', stdout => {
        if (!stdout.trim()) return;
        redis_worker_log.info(stdout.trim());
    });

    py.on('close', () => {
        redis_worker_log.warn('server closed');
        if (full_stderr.includes('Traceback (most recent call last):')) {
            const last_traceback =
                '\nTraceback (most recent call last):' + full_stderr.split('Traceback (most recent call last):').pop();
            console.log(last_traceback);
            redis_worker_log.error(last_traceback);
            redis_worker_log.error('Server closed with error');

            Alert.error(last_traceback);
            btn_dispatch_event(btn, { py, pyfile, error: last_traceback }, 'fail');
        }
        btn_dispatch_event(btn, { py, pyfile, pyChild }, 'close');
    });

    py.on('error', error => {
        console.error(error);
        Alert.error(error);
        redis_worker_log.error(error);
        btn_dispatch_event(btn, { py, pyfile, error }, 'fail');
    });
};
