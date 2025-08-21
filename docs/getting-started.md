# Getting Started

Welcome to the ChemXploreML documentation! ChemXploreML is a modular desktop application designed to simplify the process of predicting molecular properties using advanced machine learning techniques. This guide will help you quickly set up and start using ChemXploreML.

:::tip Citation
Marimuthu, A. N. & McGuire, B. A. Machine Learning Pipeline for Molecular Property Prediction Using ChemXploreML. J. Chem. Inf. Model. 65, 5424–5437 (2025). [DOI: 10.1021/acs.jcim.5c00516](https://pubs.acs.org/doi/10.1021/acs.jcim.5c00516)
:::

## Download and Installation

<DownloadLinks />

For other versions, please visit the [**GitHub releases page**](https://github.com/aravindhnivas/ChemXploreML/releases).

### Initial Setup

1. Download the appropriate installer for your system.
2. Run the installer:
   - On **macOS**, open the `.dmg` file and drag the ChemXploreML app into your `Applications` folder.
   - On **Windows**, run the `.exe` installer and follow the on-screen instructions.
   - On **Linux**, you can download the `.AppImage`, `.deb`, or `.rpm` file from the releases page.

### macOS Installation

:::warning macOS Gatekeeper Warning
macOS may prevent launching unsigned apps. To bypass this, after installing the app to your `Applications` folder, run the following command in your terminal:

```bash
xattr -c /Applications/ChemXploreML.app
```

This is a temporary workaround. A notarized version will be released in a future update.
:::

### Linux Installation

To run the AppImage on Linux, first make it executable:

```bash
chmod +x ChemXploreML-*.AppImage
./ChemXploreML-*.AppImage
```

## Quick Start Guide

Follow these steps to train your first model with ChemXploreML:

### 1. Load Your Data

- Launch ChemXploreML.
- Navigate to the **Load File** tab and use the file browser to load your dataset (e.g., a `.csv` file).
- Configure the **Column X** (SMILES) and **Column Y** (target property) fields.

### 2. Generate Molecular Embeddings

- Go to the **Embed Molecule** tab.
- Select an embedding model (e.g., `mol2vec`).
- Click the **Run** button to generate the embeddings for your dataset. The embeddings will be saved as a `.npy` file.

### 3. Train Your Machine Learning Model

- Navigate to the **ML Training** tab.
- In the **Model Panel**, select a machine learning algorithm (e.g., Random Forest).
- In the **Save Model Panel**, specify a name for your trained model.
- Click **Begin training**.
- Once training is complete, you can view the results in the **Results Panel**.

### 4. Predict Molecular Properties

- Go to the **ML Prediction** tab.
- Load your trained model (`.pkl` file).
- Provide a file with new molecules to predict.
- Run the prediction to get the results.

## What's Next?

Enjoy exploring your molecular datasets with ChemXploreML! For more detailed information, please refer to the other sections of this documentation.
