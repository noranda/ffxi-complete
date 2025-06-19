import '@testing-library/jest-dom/vitest';

import {cleanup} from '@testing-library/react';
import {afterEach, beforeAll, vi} from 'vitest';

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock browser APIs that are not available in jsdom
beforeAll(() => {
  // Mock window.matchMedia for Drawer component (vaul library)
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
  });

  // Mock ResizeObserver for Drawer component
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock DOMRect for getBoundingClientRect
  const mockDOMRectInstance = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
  };

  Object.defineProperty(global, 'DOMRect', {
    writable: true,
    value: vi.fn().mockImplementation(() => mockDOMRectInstance),
  });

  // Add the fromRect static method
  (global.DOMRect as typeof DOMRect).fromRect = vi
    .fn()
    .mockImplementation(() => mockDOMRectInstance);

  // Mock HTMLElement.getBoundingClientRect
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
  }));

  // Mock setPointerCapture and releasePointerCapture for vaul library
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();

  // Mock CSS transform properties for vaul library
  Object.defineProperty(Element.prototype, 'style', {
    value: {
      transform: '',
      webkitTransform: '',
      mozTransform: '',
    },
    writable: true,
  });
});
