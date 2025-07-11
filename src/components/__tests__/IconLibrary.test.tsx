/**
 * IconLibrary Component Tests
 *
 * Tests for the development icon library component.
 */

import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import {IconLibrary} from '../icons';

// Mock the icon registry
vi.mock('@/icons/registry.json', () => ({
  default: [
    {category: 'magic', id: 26, name: 'cure', tags: ['cure', 'heal', 'hp']},
    {category: 'magic', id: 27, name: 'fire', tags: ['fire', 'element', 'red']},
    {category: 'status', id: 1, name: 'poison', tags: ['poison', 'toxic', 'debuff']},
    {category: 'status', id: 20, name: 'haste', tags: ['haste', 'speed', 'buff']},
  ],
}));

// Mock the IconTagsService
vi.mock('@/lib/services/iconTagsService', () => ({
  IconTagsService: {
    getAllIconTags: vi.fn(() => Promise.resolve({data: [], error: null})),
    saveIconTags: vi.fn(() => Promise.resolve({error: null, success: true})),
  },
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

// Mock IntersectionObserver globally for jsdom
class MockIntersectionObserver {
  constructor(_callback: any, _options?: any) {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
MockIntersectionObserver.prototype.observe = function () {};
MockIntersectionObserver.prototype.unobserve = function () {};
MockIntersectionObserver.prototype.disconnect = function () {};
global.IntersectionObserver = MockIntersectionObserver as any;

describe('IconLibrary', () => {
  it('renders the icon library with header', async () => {
    render(<IconLibrary />);

    expect(screen.getByText('FFXI Icon Library')).toBeInTheDocument();
    expect(screen.getByText('Development Tool')).toBeInTheDocument();
    expect(screen.getByText('Back to App')).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText('Loading Icon Library')).not.toBeInTheDocument());
  });

  it('displays all icons by default', async () => {
    render(<IconLibrary />);

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText('Loading Icon Library')).not.toBeInTheDocument());

    await waitFor(() => {
      expect(screen.getAllByText('poison')[0]).toBeInTheDocument();
      expect(screen.getAllByText('haste')[0]).toBeInTheDocument();
      expect(screen.getAllByText('cure')[0]).toBeInTheDocument();
      expect(screen.getAllByText('fire')[0]).toBeInTheDocument();
    });
  });

  it('filters icons by search term', async () => {
    render(<IconLibrary />);

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText('Loading Icon Library')).not.toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('Search icons by name, description, or tags...');
    fireEvent.change(searchInput, {target: {value: 'cure'}});

    await waitFor(() => {
      expect(screen.getAllByText('cure')[0]).toBeInTheDocument();
      expect(screen.queryByText('poison')).not.toBeInTheDocument();
    });
  });

  it('searches icons by tags', async () => {
    render(<IconLibrary />);

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText('Loading Icon Library')).not.toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('Search icons by name, description, or tags...');
    fireEvent.change(searchInput, {target: {value: 'heal'}});

    // Should find the cure icon which has 'heal' tag
    await waitFor(() => {
      expect(screen.getAllByText('cure')[0]).toBeInTheDocument();
      expect(screen.queryByText('poison')).not.toBeInTheDocument();
      expect(screen.queryByText('fire')).not.toBeInTheDocument();
    });
  });

  it('displays tags on icon cards', async () => {
    render(<IconLibrary />);

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText('Loading Icon Library')).not.toBeInTheDocument());

    // Should display tags for poison icon
    await waitFor(() => {
      expect(screen.getAllByText('poison')[0]).toBeInTheDocument();
      expect(screen.getByText('toxic')).toBeInTheDocument();
      expect(screen.getAllByText('debuff')[0]).toBeInTheDocument();
    });
  });

  it('filters icons by category', async () => {
    render(<IconLibrary />);

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText('Loading Icon Library')).not.toBeInTheDocument());

    const categorySelect = screen.getByDisplayValue(/All Categories/);
    fireEvent.change(categorySelect, {target: {value: 'magic'}});

    await waitFor(() => {
      expect(screen.getAllByText('cure')[0]).toBeInTheDocument();
      expect(screen.getAllByText('fire')[0]).toBeInTheDocument();
      expect(screen.queryByText('poison')).not.toBeInTheDocument();
    });
  });

  it('shows results count', async () => {
    render(<IconLibrary />);

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText('Loading Icon Library')).not.toBeInTheDocument());

    await waitFor(() => expect(screen.getByText('Showing 4 of 4 icons')).toBeInTheDocument());
  });

  it('displays icon details', async () => {
    render(<IconLibrary />);

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText('Loading Icon Library')).not.toBeInTheDocument());

    await waitFor(() => {
      // Since the mock data doesn't have description fields, it uses name as description
      expect(screen.getAllByText('poison')[0]).toBeInTheDocument();
      expect(screen.getByText('ID: 1')).toBeInTheDocument();
      expect(screen.getAllByText('status')).toHaveLength(2); // Two status category icons
    });
  });

  it('copies icon usage code when card is clicked', async () => {
    render(<IconLibrary />);

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText('Loading Icon Library')).not.toBeInTheDocument());

    // Wait for icons to load and find all cure text elements
    await waitFor(() => expect(screen.getAllByText('cure').length).toBeGreaterThan(0));

    // Find the icon card container by looking for the icon name element with title and get its parent card
    const iconNameElement = screen.getAllByText('cure').find(el => el.hasAttribute('title'));
    const iconCard = iconNameElement?.closest('[class*="group relative cursor-pointer"]');
    if (iconCard) {
      fireEvent.click(iconCard);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('<FFXIIcon category="magic" name="cure" size="md" />');
    }
  });

  it('shows no results message when no icons match search', async () => {
    render(<IconLibrary />);

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText('Loading Icon Library')).not.toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('Search icons by name, description, or tags...');
    fireEvent.change(searchInput, {target: {value: 'nonexistent'}});

    await waitFor(() => {
      expect(screen.getByText('No icons found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search terms or category filter')).toBeInTheDocument();
    });
  });
});
