import { pyVersion, pyServerReady, pyPackageVersion } from '$lib/pyserver/stores';
import computefromServer from '$lib/pyserver/computefromServer';
import { asset_download_required } from './stores';

export async function getPyVersion(e?: MouseEvent) {
    if (!get(pyServerReady)) {
        toast.error('start python server first!');
        return Promise.reject('start python server first!');
    }

    const dataFromPython = await computefromServer<{ python: string; pyPackageVersion: string }>({
        pyfile: 'getVersion',
        args: [''],
        scheduler: false,
    });

    if (!dataFromPython) {
        toast.error('Could not access pyfile');
        return Promise.reject('Could not access pyfile');
    }
    console.log(dataFromPython);
    pyVersion.set(dataFromPython.python);
    pyPackageVersion.set(dataFromPython.pyPackageVersion);

    if (get(pyPackageVersion) < import.meta.env.VITE_PY_MIN_VERSION) {
        asset_download_required.set(true);
    }

    return Promise.resolve(dataFromPython);
}
