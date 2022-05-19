import vitePluginString from 'vite-plugin-string'

export default {
  base: '/indietopia-interactive-site/',
  plugins: [
    vitePluginString()
  ],
  build: {
    chunkSizeWarningLimit: 1600,
  },
}
