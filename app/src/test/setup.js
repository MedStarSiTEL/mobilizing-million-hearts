import '@testing-library/jest-dom'

// Mock environment variables
global.process = {
  env: {
    NODE_ENV: 'test',
    CLIENT_ID: 'test-client-id',
    SCOPE: 'test-scope',
    ISS: 'https://test-server/',
    REDIRECT_URI: 'http://localhost:3000/',
    AUDITING: 'false',
    ENABLE_DEVELOPERS_LOG: 'false',
    BLOODPRESSURE_CUTOFF: '5',
    CHOLESTEROL_CUTOFF: '5',
  }
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}))

// Mock chartjs-plugin-annotation
vi.mock('chartjs-plugin-annotation', () => ({
  default: {},
}))