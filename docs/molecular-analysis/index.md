# Molecular Analysis

The Molecular Analysis module in ChemXploreML provides comprehensive tools for analyzing and visualizing molecular properties. By inputting a SMILES string, you can generate a detailed report covering various aspects of the molecule's structure and physicochemical properties.

## Overview

![Molecular Analysis Overview](/screenshots/molecular-analysis/cxml-molecular-analysis-overview.png)

The analysis is organized into several categories, allowing you to focus on specific areas of interest. The following sections detail the properties calculated in each category.

## Key Features

### Basic Properties

- **Number of Atoms**: Total count of atoms in the molecule.
- **Number of Bonds**: Total count of bonds in the molecule.
- **Molecular Weight**: The molecular weight of the molecule.

### Ring Information

- **Number of Rings**: Total count of rings.
- **Ring Sizes**: A list of the sizes of each ring.

### Chain Information

- **Longest Alkane Chain**: Length of the longest single-bonded carbon chain.
- **Longest Alkene Chain**: Length of the longest double-bonded carbon chain.
- **Longest Alkyne Chain**: Length of the longest triple-bonded carbon chain.
- **Number of Alkane Chains**: Total count of single-bonded carbon chains.
- **Number of Alkene Chains**: Total count of double-bonded carbon chains.
- **Number of Alkyne Chains**: Total count of triple-bonded carbon chains.

### Aromaticity

- **Number of Aromatic Rings**: Total count of aromatic rings.
- **Number of Aromatic Atoms**: Total count of atoms participating in aromatic rings.

### Functional Groups

This section provides counts for various functional groups, including but not limited to:

- Alcohols, Aldehydes, Ketones
- Carboxylic Acids, Esters, Ethers
- Amines, Amides, Nitro compounds
- Nitriles, Sulfides, Sulfoxides, Sulfones, Thiols
- Alkenes, Alkynes, Halides (Alkyl and Aryl), Phenols

### Physicochemical Properties

- **LogP**: The logarithm of the partition coefficient, a measure of lipophilicity.
- **TPSA (Topological Polar Surface Area)**: A measure of the polar surface area of the molecule.
- **Number of Hydrogen Bond Donors (HBD)**
- **Number of Hydrogen Bond Acceptors (HBA)**
- **Number of Rotatable Bonds**

### Heterocyclicity

- **Number of Heterocycles**: The number of rings containing at least one non-carbon atom.
- **Percent of Heteroatoms in Heterocycles**: The percentage of non-carbon atoms within the heterocyclic rings.

## Usage Guidelines

1. **Input SMILES**: Enter the SMILES string of the molecule you wish to analyze in the input field.
2. **Run Analysis**: Click the "Analyse" button to perform the calculations.
3. **View Results**: The calculated properties will be displayed, categorized as listed above. You can use the checkboxes to show or hide different property categories.

## Next Steps

After analyzing a molecule, you can use this information for various purposes, such as:

- Comparing different molecules.
- Preparing data for machine learning models.
- Understanding structure-property relationships.
