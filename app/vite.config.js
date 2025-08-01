import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react', 
        'react-dom',
        'bootstrap',
        'react-bootstrap',
        'chart.js',
        'react-chartjs-2',
        'fhirclient',
        'lodash',
        'date-fns',
        'date-fns-tz',
        'uuid'
      ]
    },
    
    // Define global constants for environment variables
    define: {
      'process.env.CLIENT_ID': JSON.stringify(env.CLIENT_ID),
      'process.env.SCOPE': JSON.stringify(env.SCOPE),
      'process.env.ISS': JSON.stringify(env.ISS),
      'process.env.REDIRECT_URI': JSON.stringify(env.REDIRECT_URI),
      'process.env.AUDITING': JSON.stringify(env.AUDITING),
      'process.env.ENABLE_DEVELOPERS_LOG': JSON.stringify(env.ENABLE_DEVELOPERS_LOG),
      'process.env.BLOODPRESSURE_CUTOFF': JSON.stringify(env.BLOODPRESSURE_CUTOFF),
      'process.env.CHOLESTEROL_CUTOFF': JSON.stringify(env.CHOLESTEROL_CUTOFF),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },

    // Build configuration
    build: {
      outDir: 'build',
      assetsDir: 'static',
      sourcemap: command === 'serve',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            bootstrap: ['bootstrap', 'react-bootstrap'],
            charts: ['chart.js', 'react-chartjs-2', 'chartjs-plugin-annotation'],
            fhir: ['fhirclient'],
            utils: ['lodash', 'date-fns', 'date-fns-tz', 'uuid'],
          }
        }
      }
    },

    // Development server configuration
    server: {
      port: 3000,
      open: true,
      cors: true,
    },

    // Preview server configuration
    preview: {
      port: 3000,
    },

    // Test configuration for Vitest
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      css: true,
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.test.{js,jsx}',
          '**/*.spec.{js,jsx}',
        ]
      }
    },

    // Resolve configuration
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      }
    },

    // CSS configuration
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "bootstrap/scss/functions"; @import "bootstrap/scss/variables";`
        }
      }
    }
  }
})