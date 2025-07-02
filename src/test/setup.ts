import '@testing-library/jest-dom/vitest';
import {cleanup} from '@testing-library/react';
import {afterEach, beforeAll, vi} from 'vitest';

// Mock Supabase environment variables for testing
vi.mock('../lib/supabase', () => {
  const mockSupabase = {
    auth: {
      getSession: vi.fn().mockResolvedValue({data: {session: null}, error: null}),
      getUser: vi.fn().mockResolvedValue({data: {user: null}, error: null}),
      onAuthStateChange: vi.fn().mockReturnValue({data: {subscription: {unsubscribe: vi.fn()}}}),
      refreshSession: vi.fn().mockResolvedValue({data: {}, error: null}),
      resetPasswordForEmail: vi.fn().mockResolvedValue({data: {}, error: null}),
      signInWithOAuth: vi.fn().mockResolvedValue({data: {}, error: null}),
      signInWithPassword: vi.fn().mockResolvedValue({data: {}, error: null}),
      signOut: vi.fn().mockResolvedValue({error: null}),
      signUp: vi.fn().mockResolvedValue({data: {}, error: null}),
      updateUser: vi.fn().mockResolvedValue({data: {}, error: null}),
    },
    delete: vi.fn().mockResolvedValue({data: null, error: null}),
    eq: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({
      data: null,
      error: {message: 'new row violates row-level security policy'},
    }),
    limit: vi.fn().mockResolvedValue({data: [], error: null}),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({data: null, error: null}),
    storage: {
      download: vi.fn().mockResolvedValue({data: null, error: null}),
      from: vi.fn().mockReturnThis(),
      upload: vi.fn().mockResolvedValue({data: {}, error: null}),
    },
    update: vi.fn().mockReturnThis(),
  };

  return {
    supabase: mockSupabase,
  };
});

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => cleanup());

// Mock browser APIs that are not available in jsdom
beforeAll(() => {
  // Mock environment variables for tests
  vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');

  // Mock window.matchMedia for Drawer component (vaul library)
  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn().mockImplementation(
      (query: string): MediaQueryList => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(), // deprecated
        dispatchEvent: vi.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(), // deprecated
      })
    ),
    writable: true,
  });

  // Mock ResizeObserver for Drawer component
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  }));

  // Mock DOMRect for getBoundingClientRect
  const mockDOMRectInstance = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    toJSON: vi.fn(),
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  };

  Object.defineProperty(global, 'DOMRect', {
    value: vi.fn().mockImplementation(() => mockDOMRectInstance),
    writable: true,
  });

  // Add the fromRect static method
  global.DOMRect.fromRect = vi.fn().mockImplementation(() => mockDOMRectInstance);

  // Mock HTMLElement.getBoundingClientRect
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    toJSON: vi.fn(),
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  }));

  // Mock setPointerCapture and releasePointerCapture for vaul library
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();

  // Mock CSS transform properties for vaul library
  Object.defineProperty(Element.prototype, 'style', {
    value: {
      mozTransform: '',
      transform: '',
      webkitTransform: '',
    },
    writable: true,
  });
});
