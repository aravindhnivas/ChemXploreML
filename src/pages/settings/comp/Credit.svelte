<script lang="ts">
    const frontend_credits = [
        {
            name: 'Javascript',
            url: 'https://www.javascript.com/',
            icon: 'https://cdn.simpleicons.org/javascript',
        },
        {
            name: 'Typescript',
            url: 'https://www.typescriptlang.org/',
            icon: 'https://cdn.simpleicons.org/typescript',
        },
        {
            name: 'HTML',
            url: 'https://www.w3.org/TR/html52/',
            icon: 'https://cdn.simpleicons.org/html5',
        },
        {
            name: 'CSS',
            url: 'https://www.w3.org/Style/CSS/',
            icon: 'https://cdn.simpleicons.org/css3',
        },
        {
            name: 'Sass',
            url: 'https://sass-lang.com/',
            icon: 'https://cdn.simpleicons.org/sass',
        },
        {
            name: 'Dailsy UI',
            url: 'https://daisyui.com/',
            icon: 'https://cdn.simpleicons.org/daisyui',
        },
        {
            name: 'Svelte',
            url: 'https://svelte.dev/',
            icon: 'https://cdn.simpleicons.org/svelte',
        },
        {
            name: 'Svelte Material UI',
            url: 'https://sveltematerialui.com/',
            icon: 'https://cdn.simpleicons.org/svelte',
        },

        {
            name: 'Vite',
            url: 'https://vitejs.dev/',
            icon: 'https://cdn.simpleicons.org/vite',
        },
        {
            name: 'Tauri',
            url: 'https://tauri.app/',
            icon: 'https://cdn.simpleicons.org/tauri',
        },
        {
            name: 'Tailwind CSS',
            url: 'https://tailwindcss.com/',
            icon: 'https://cdn.simpleicons.org/tailwindcss',
        },
        {
            name: 'Plotly.js',
            url: 'https://plotly.com/javascript/',
            icon: 'https://cdn.simpleicons.org/plotly',
        },
        {
            name: 'Lucide Icons',
            url: 'https://lucide.dev/',
            icon: 'https://cdn.simpleicons.org/lucide',
        },
    ];

    // Backend Technologies
    // "scipy>=1.13.1",
    // "pandas>=2.2.2",
    // "dask>=2024.8.2",
    // "dask-ml>=2024.4.4",
    // "numba>=0.60.0",
    // "numpy==1.26.4",
    // "flask>=3.0.3",
    // "flask-cors>=5.0.0",
    // "scikit-learn>=1.5.1",
    // "selfies>=2.1.2",
    // "loguru>=0.7.2",
    // "waitress>=3.0.0",
    // "xgboost>=2.1.1",
    // "catboost>=1.2.5",
    // "lightgbm>=4.5.0",
    // "joblib>=1.4.2",
    // "h5py>=3.11.0",
    // "pyinstaller>=6.10.0",
    // "gensim>=4.3.3",
    // "mol2vec @ git+https://github.com/aravindhnivas/mol2vec.git@gensim_v4",
    // "astrochem_embedding @ git+https://github.com/aravindhnivas/astrochem_embedding.git@main",
    // "rdkit>=2024.3.6",
    // "shap>=0.46.0",
    // "optuna>=4.0.0",
    // "optuna-dashboard>=0.16.2",
    // "optuna-integration>=4.0.0",
    // "mapply>=0.1.27",
    // "kaleido>=0.2.1",
    // "statsmodels>=0.14.4",
    // "matplotlib>=3.9.2",
    // "seaborn>=0.13.2",
    // "sigfig>=1.3.3",
    // "redis>=5.1.1",
    // "rq>=2.3.1",
    // "rq-dashboard>=0.8.0.2",
    // "flask-socketio>=5.4.1",
    // "eventlet>=0.37.0",
    // "cleanlab>=2.7.0",
    // "lightning>=2.4.0",
    // "uncertainties>=3.2.2",
    // "umap-learn>=0.5.7",
    // "nbformat>=5.10.4",
    // "tables>=3.10.1",
    // "dbcv @ git+https://github.com/FelSiq/DBCV.git@main",
    const backend_credits = [
        {
            name: 'Python',
            url: 'https://www.python.org/',
            icon: 'https://cdn.simpleicons.org/python',
        },
        {
            name: 'Flask',
            url: 'https://flask.palletsprojects.com/',
            icon: 'https://cdn.simpleicons.org/flask',
        },
        {
            name: 'Redis',
            url: 'https://redis.io/',
            icon: 'https://cdn.simpleicons.org/redis',
        },
        {
            name: 'NumPy',
            url: 'https://numpy.org/',
            icon: 'https://cdn.simpleicons.org/numpy',
        },
        {
            name: 'SciPy',
            url: 'https://scipy.org/',
            icon: 'https://cdn.simpleicons.org/scipy',
        },
        {
            name: 'Pandas',
            url: 'https://pandas.pydata.org/',
            icon: 'https://cdn.simpleicons.org/pandas',
        },
        {
            name: 'Dask',
            url: 'https://dask.org/',
            icon: 'https://cdn.simpleicons.org/dask',
        },
        {
            name: 'Numba',
            url: 'https://numba.pydata.org/',
            icon: 'https://cdn.simpleicons.org/numba',
        },
        {
            name: 'Scikit-learn',
            url: 'https://scikit-learn.org/',
            icon: 'https://cdn.simpleicons.org/scikitlearn',
        },
        {
            name: 'Lightning',
            url: 'https://www.pytorchlightning.ai/',
            icon: 'https://cdn.simpleicons.org/lightning',
        },
        {
            name: 'TQDM',
            url: 'https://tqdm.github.io/',
            icon: 'https://cdn.simpleicons.org/tqdm',
        },
        {
            name: 'Optuna',
            url: 'https://optuna.org/',
            // icon: 'https://cdn.simpleicons.org/optuna',
        },
    ];

    const other_credits = [
        {
            name: 'GitHub',
            url: 'https://github.com/',
            icon: 'https://cdn.simpleicons.org/github',
        },
    ];
</script>

<h2 class="text-lg font-semibold">Frontend Technologies</h2>
<div class="flex-gap items-center flex-wrap">
    {#each frontend_credits as item}
        <a
            href={item.url}
            target="_blank"
            class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 bg-white"
        >
            {#if item.icon}
                <img src={item.icon} alt={item.name} class="w-6 h-6" />
            {/if}
            <span>{item.name}</span>
        </a>
    {/each}
</div>
<div class="divider" />
<h2 class="text-lg font-semibold">Backend Technologies</h2>

<div class="flex-gap items-center flex-wrap">
    {#each backend_credits as item}
        <a
            href={item.url}
            target="_blank"
            class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 bg-white"
        >
            <img src={item.icon} alt={item.name} class="w-6 h-6" />
            <span>{item.name}</span>
        </a>
    {/each}
</div>

<div class="divider" />
<h2 class="text-lg font-semibold">Other Credits</h2>
<div class="flex-gap items-center flex-wrap">
    {#each other_credits as item}
        <a
            href={item.url}
            target="_blank"
            class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 bg-white"
        >
            <img src={item.icon} alt={item.name} class="w-6 h-6" />
            <span>{item.name}</span>
        </a>
    {/each}
</div>
