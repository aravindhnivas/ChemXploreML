export const get_assets_zip_name = async () => {
    const platformName = (await platform()) as 'windows' | 'macos' | 'linux';
    const cpu_arch = (await arch()) as 'x86_64' | 'aarch64';
    return `${import.meta.env.VITE_pypackage}-${platformName}-${cpu_arch}.zip`;
};
