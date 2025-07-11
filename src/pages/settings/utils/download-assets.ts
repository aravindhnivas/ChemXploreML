import { pyPackageVersion, pyServerReady } from '$lib/pyserver/stores';
import {
    outputbox,
    python_asset_ready,
    asset_download_required,
    installing_python_assets,
    assets_version_available,
    assets_installation_required,
    python_asset_ready_to_install,
    install_update_without_promt,
    serverInfo,
} from './stores';
import { isEmpty } from 'lodash-es';
import { start_and_check_pypackage_with_toast, stopServer } from '$lib/pyserver';
import { footerMsg } from '$lib/utils/initialise';
import { auto_download_and_install_assets } from './assets-status';
import { sleep } from '$lib/utils/initialise';
import { Alert } from '$utils/stores';
import { git_url } from '$lib/utils';
import { download_url } from '$lib/utils/download';

let assets_downloading = false;
let assets_installing = false;

export const asset_name_prefix = import.meta.env.VITE_pypackage;

export const remove_asset_folder = async (filename: string) => {
    try {
        const asset_folder = await path.join(await path.appLocalDataDir(), filename);
        if (!(await fs.exists(asset_folder))) return;
        outputbox.warn(`Deleting the existing folder: ${asset_folder}`);
        await fs.remove(asset_folder, { recursive: true });
        outputbox.warn(`Deleted the existing folder: ${asset_folder}`);
        return Promise.resolve(asset_folder + ' folder deleted');
    } catch (error) {
        if (error instanceof Error) Alert.error(error);
        return Promise.reject(`Could not delete the existing ${filename} folder\n ${JSON.stringify(error)}`);
    }
};

export async function downloadZIP() {
    try {
        if (!window.navigator.onLine) {
            outputbox.warn('No internet connection');
            return;
        }
        if (assets_downloading) return outputbox.warn('already downloading assets...');
        const platformName = (await platform()) as 'windows' | 'macos' | 'linux';
        const old_names = {
            macos: 'darwin',
            linux: 'linux',
            windows: 'win32',
        };
        const currentplatform = old_names[platformName];
        const asset_name = `${asset_name_prefix}-${currentplatform}.zip`;
        let browser_download_url = '';

        assets_downloading = true;

        if (isEmpty(current_release_data)) {
            outputbox.error('To download assets, first check assets update to obtain release data...');
            return;
        }

        const { assets } = current_release_data;
        const asset_ind = assets.findIndex(e => e.name === asset_name);

        if (asset_ind === -1) {
            outputbox.error('Could not find the assets in the release data');
            return;
        }

        browser_download_url = assets[asset_ind].browser_download_url;

        outputbox.warn('downloading assets...');
        outputbox.warn(browser_download_url);
        const localdir = await path.appLocalDataDir();
        await download_url(browser_download_url, localdir);
    } catch (err) {
        outputbox.error(`error occured while downloading assets`);
        outputbox.error(err as string);
    } finally {
        assets_downloading = false;
    }
}

export function unZIP(installation_request = true) {
    let warning = '';
    if (assets_installing) warning = 'already installing assets...';
    if (!get(python_asset_ready_to_install)) warning = 'no assets to install';

    if (warning) {
        console.warn(warning);
        outputbox.warn(warning);
        return Promise.reject(warning);
    }

    assets_installing = true;
    outputbox.warn('unzipping assets...');

    return new Promise(async (resolve, reject) => {
        const localdir = await path.appLocalDataDir();
        const platformName = (await platform()) as 'windows' | 'macos' | 'linux';
        const old_names = {
            macos: 'darwin',
            linux: 'linux',
            windows: 'win32',
        };
        const currentplatform = old_names[platformName];
        const asset_name = `${asset_name_prefix}-${currentplatform}.zip`;
        const asset_zipfile = await path.join(localdir, asset_name);

        footerMsg.set({ msg: 'installing assets...', status: 'running' });

        if (installation_request) {
            if (!(await dialog.confirm('Install it now ?', { title: 'Python assets update ready.' }))) {
                footerMsg.set({ msg: '', status: 'idle' });
                assets_installation_required.set(true);
                assets_installing = false;
                return reject('installation skipped');
            }
        }
        install_update_without_promt.set(true);

        if (get(pyServerReady)) {
            await stopServer({ update_info: false });
        }

        await remove_asset_folder('umdapy');
        await remove_asset_folder(asset_name_prefix);

        const cmd = shell.Command.create('tar', ['-xf', asset_zipfile, '-C', localdir]);

        let err: string;
        const child = await cmd.spawn();

        installing_python_assets.set(true);
        outputbox.info(`unzip PID: ${child.pid}`);
        outputbox.warn('Please wait while assets are being installed...');

        cmd.on('close', async () => {
            assets_installing = false;
            if (err) {
                footerMsg.set({ msg: 'failed to install assets', status: 'done' });
                outputbox.error('failed to UNZIP');
                reject('failed to UNZIP');
            } else {
                footerMsg.set({ msg: 'assets installation completed', status: 'done' });
                outputbox.success('UNZIP success');
                assets_installation_required.set(false);
                resolve('UNZIP success');
                await sleep(1000);
                await fs.remove(asset_name, { baseDir: fs.BaseDirectory.AppLocalData });
            }
            installing_python_assets.set(false);

            outputbox.warn('UNZIP process closed');
            python_asset_ready_to_install.set(false);
            await sleep(1000);
            await start_and_check_pypackage_with_toast();
            setTimeout(() => footerMsg.set({ msg: '', status: 'idle' }), 1 * 60 * 1000);
        });

        cmd.on('error', error => {
            err = error;
            outputbox.error('Error whiile UNZIPing assets');
            outputbox.error(error);
        });

        cmd.stderr.on('data', stderr => {
            err = stderr;
            outputbox.error(stderr);
        });

        // cmd.stdout.on('data', stdout => {
        //     outputbox.info(stdout);
        // });
    });
}

let current_release_data: GithubRelease = {} as GithubRelease;

const get_assets_url = async () => {
    const response = await axios<GithubRelease>(git_url.py.latest());
    if (!response) return;

    if (response.status !== 200) return outputbox.error('Could not download the assets');

    current_release_data = response.data;
    assets_version_available.set(response.data.tag_name);

    if (!get(assets_version_available)) return outputbox.error('Could not determine assets version');
    return true;
};

const fn_asset_download_required = async ({
    installation_request,
    download_request,
}: {
    installation_request: boolean;
    download_request: boolean;
}) => {
    outputbox.warn(`Download required`);
    asset_download_required.set(true);
    await auto_download_and_install_assets({ installation_request, download_request });
    return;
};

export const check_assets_update = async ({ installation_request = true, download_request = false } = {}) => {
    if (!window.navigator.onLine) return;

    if (get(python_asset_ready_to_install)) {
        return outputbox.warn('assets updates are ready to install');
    }

    if (!(await get_assets_url())) return;
    outputbox.info(JSON.stringify(current_release_data, null, 2));
    outputbox.info(`Python assets available version: ${get(assets_version_available)}`);

    if (!get(pyPackageVersion)) {
        outputbox.error('Python assets current version not determined yet.');
        return;
    }
    outputbox.info(`Python assets current version: v${get(pyPackageVersion)}`);

    if (`v${get(pyPackageVersion)}` < get(assets_version_available)) {
        await fn_asset_download_required({ installation_request, download_request });
        return;
    }

    if (get(pyPackageVersion) < import.meta.env.VITE_PY_MIN_VERSION) {
        await fn_asset_download_required({ installation_request, download_request });
        return;
    }

    outputbox.warn(`Python assets download not required`);
    asset_download_required.set(false);
};

export const download_assets = async () => {
    if (!window.navigator.onLine) {
        outputbox.warn('No internet connection');
        return;
    }

    if (!get(python_asset_ready)) {
        if (!(await get_assets_url())) return;
        await downloadZIP();
        return;
    }

    if (!get(python_asset_ready) && !get(asset_download_required)) {
        if (!(await dialog.confirm('continue downloading', { title: 'Download NOT required' }))) return;
    }

    await downloadZIP();
};

export const install_pypackage_from_zipfile = async () => {
    try {
        const result = (await dialog.open({
            directory: false,
            filters: [
                { name: 'zip files', extensions: ['zip'] },
                { name: 'All files', extensions: ['*.*'] },
            ],
            multiple: false,
        })) as string;

        if (!result) return;

        serverInfo.warn(result);
        const platformName = (await platform()) as 'windows' | 'macos' | 'linux';
        const old_names = {
            macos: 'darwin',
            linux: 'linux',
            windows: 'win32',
        };
        const currentplatform = old_names[platformName];
        const asset_name = `${asset_name_prefix}-${currentplatform}.zip`;
        const localdir = await path.appLocalDataDir();
        const asset_zipfile = await path.join(localdir, asset_name);

        await fs.copyFile(result, asset_zipfile);
        serverInfo.warn('file copied');
        python_asset_ready_to_install.set(true);
        await unZIP(false);
    } catch (error) {
        if (error instanceof Error) Alert.error(error);
    }
};
