<template>
  <div class="version-info">
    <p class="current-version">Current Version: <strong>v{{ latestVersion }}</strong></p>
  </div>
  <div class="download-links">
    <table>
      <thead>
        <tr>
          <th>Platform</th>
          <th>Download Link</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>macOS (Apple Silicon)</td>
          <td>
            <a 
              :href="`https://github.com/aravindhnivas/ChemXploreML/releases/latest/download/ChemXploreML_${latestVersion}_aarch64.dmg`"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </td>
        </tr>

        <tr>
          <td>macOS (Intel - x64)</td>
          <td>
            <a 
              :href="`https://github.com/aravindhnivas/ChemXploreML/releases/latest/download/ChemXploreML_${latestVersion}_x64.dmg`"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </td>
        </tr>
        <tr>
          <td>macOS (Universal - Intel and Apple Silicon)</td>
          <td>
            <a 
              :href="`https://github.com/aravindhnivas/ChemXploreML/releases/latest/download/ChemXploreML_${latestVersion}_universal.dmg`"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </td>
        </tr>
        <tr>
          <td>Windows (x64)</td>
          <td>
            <a 
              :href="`https://github.com/aravindhnivas/ChemXploreML/releases/latest/download/ChemXploreML_${latestVersion}_x64-setup.exe`"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </td>
        </tr>

        <!-- for linux AppImage -->
        <tr>
          <td>Linux (AppImage - x64)</td>
          <td>
            <a 
              :href="`https://github.com/aravindhnivas/ChemXploreML/releases/latest/download/ChemXploreML_${latestVersion}_amd64.AppImage`"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  const latestVersion = ref('4.6.2') // fallback version

  onMounted(async () => {
    try {
      const response = await fetch('https://api.github.com/repos/aravindhnivas/ChemXploreML/releases/latest')
      if (response.ok) {
        const data = await response.json()
        latestVersion.value = data.tag_name.replace('v', '') // remove 'v' prefix if present
      }
    } catch (error) {
      console.warn('Failed to fetch latest version:', error)
      // Keep the fallback version
    }
  })
</script>

<style scoped>
.download-links table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.download-links th,
.download-links td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.download-links th {
  font-weight: 600;
  background-color: #f9fafb;
}

.download-links a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.download-links a:hover {
  text-decoration: underline;
}

.version-info {
  margin-bottom: 1rem;
}

.current-version {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}
</style>
