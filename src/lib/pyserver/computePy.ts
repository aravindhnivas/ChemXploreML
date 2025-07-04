import computefromServer from './computefromServer';
import computefromSubprocess from './computefromSubprocess';
import { fetchServerROOT, start_and_check_pypackage_with_toast } from '$lib/pyserver';
import { pyServerReady, get, developerMode, pyProgram } from './stores';
import { Alert } from '$utils/stores';

interface ComputePyType<T extends object = Record<string, string>> {
    pyfile: string;
    args: T;
    target: HTMLButtonElement;
    subprocess?: boolean;
    cancelToken?: any;
}

export default async function <T extends Record<string, any>>({
    target,
    pyfile,
    args,
    subprocess,
    cancelToken,
}: ComputePyType) {
    let dataFromPython: T & { done: boolean; error: boolean; computed_time: string };

    try {
        console.log(`Running python in ${subprocess ? 'subprocess' : 'server'} mode`);
        console.warn(`Running python in ${get(developerMode) ? 'developer' : 'production'} mode \n ${get(pyProgram)}`);
        console.warn({ pyfile, args, subprocess });
        if (subprocess) {
            const response = await computefromSubprocess<T>({
                pyfile,
                args,
                target,
            });
            if (!response) return Promise.reject('error occured in subprocess');
            dataFromPython = response as T & { done: boolean; error: boolean; computed_time: string };
            return Promise.resolve(dataFromPython);
        }
        if (!get(pyServerReady)) {
            await fetchServerROOT();
            const result = await dialog.ask('Start the server ?', {
                kind: 'warning',
                title: import.meta.env.VITE_pypackage + 'server not running',
            });
            console.log(result);
            if (!result) return Promise.reject('Server not started');
            await start_and_check_pypackage_with_toast();
        }
        const response = await computefromServer<T>({
            pyfile,
            args,
            cancelToken,
        });

        if (!response) return Promise.reject('error occured in server');
        dataFromPython = response as T & { done: boolean; error: boolean; computed_time: string; warnings: string[] };
        return Promise.resolve(dataFromPython);
    } catch (error) {
        Alert.error(error);
    }
}
