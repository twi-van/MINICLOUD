import react from '@vitejs/plugin-react'
import { defineConfig, type ViteDevServer } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { generateBlog } from './scripts/generate-blog.ts'
import { posts } from './src/features/blog/data/posts.ts'

// Emit real HTML before Vite discovers the multi-page build inputs.
generateBlog()

function configureBlogRoutes(server: Pick<ViteDevServer, 'middlewares'>) {
  server.middlewares.use((request, response, next) => {
    const url = new URL(request.url || '/', 'http://localhost')
    const legacy = posts.find((post) => url.pathname.replace(/\/$/, '') === `/blog/${post.id}`)
    const target = legacy ? `/blog/${legacy.htmlFile}` : url.pathname === '/blog' ? '/blog/' : null
    if (target) {
      response.writeHead(301, { Location: target + url.search })
      response.end()
      return
    }
    next()
  })
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'static-blog-routes',
      configureServer: configureBlogRoutes,
      configurePreviewServer: configureBlogRoutes,
    },
  ],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        ['index.html', 'blog/index.html', ...posts.map((post) => `blog/${post.htmlFile}`)].map(
          (path) => [path, fileURLToPath(new URL(path, import.meta.url))],
        ),
      ),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
