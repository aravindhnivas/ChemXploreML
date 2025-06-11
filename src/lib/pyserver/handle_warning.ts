import { Alert } from '$utils/stores';
import { suppressed_warnings, get } from './stores';
import { suppress_py_warnings } from '$pages/settings/stores';
import { getID } from '$lib/utils/initialise';

export default function handle_warning(pyfile: string, warnings: string[]) {
    if (!warnings || warnings.length === 0) return;
    if (!get(suppress_py_warnings)) {
        Alert.warn(warnings.join('\n'));
        return;
    }

    suppressed_warnings.update(w => {
        const timestamp = new Date().toLocaleString();
        const currnet_warning = { timestamp, warnings, id: getID(5) };
        if (w[pyfile]) {
            w[pyfile] = [...w[pyfile], currnet_warning];
        } else {
            w[pyfile] = [currnet_warning];
        }
        if (w[pyfile].length > 5) {
            w[pyfile].shift();
        }
        return w;
    });

    console.warn(get(suppressed_warnings));
}
