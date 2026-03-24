import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { forwardAIChatCompletion } from './server/aiProxy.js'

function siliconFlowDevProxy(env) {
  return {
    name: 'siliconflow-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai/chat', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next()
        }

        let rawBody = ''
        req.on('data', chunk => {
          rawBody += chunk
        })

        req.on('end', async () => {
          try {
            const body = rawBody ? JSON.parse(rawBody) : {}
            const result = await forwardAIChatCompletion({
              body,
              env
            })

            Object.entries(result.headers || {}).forEach(([key, value]) => {
              res.setHeader(key, value)
            })
            res.statusCode = result.statusCode
            res.end(result.body)
          } catch (error) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              error: {
                message: error?.message || 'Local AI proxy failed.'
              }
            }))
          }
        })
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
  plugins: [vue(), siliconFlowDevProxy(env)],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 8888,
    host: '0.0.0.0',
    open: true
  },
  build: {
    // 生产环境构建目标
    target: 'modules',
    // 输出目录
    outDir: 'dist',
    // 生成源码映射
    sourcemap: false,
    // 最小化混淆
    minify: 'esbuild',
    // CSS 代码拆分
    cssCodeSplit: true,
    // Rollup 选项
    rollupOptions: {
      output: {
        // 分块策略
        manualChunks: {
          'vue-vendor': ['vue'],
          'utils': ['./src/utils/aiService.js', './src/utils/storage.js']
        },
        // 资源文件命名
        assetFileNames: 'assets/[name].[hash].[ext]',
        // 分块文件命名
        chunkFileNames: 'assets/[name].[hash].js',
        // 入口文件命名
        entryFileNames: 'assets/[name].[hash].js'
      }
    },
    // chunk 大小警告限制 (KB)
    chunkSizeWarningLimit: 1000
  },
  // 依赖预构建
  optimizeDeps: {
    include: ['vue', 'canvas-confetti']
  }
}})
