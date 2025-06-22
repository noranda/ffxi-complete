import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it} from 'vitest';

import {Tabs} from '../tabs';

describe('Tabs Component', () => {
  describe('Basic Rendering', () => {
    it('renders tabs with default value', () => {
      render(
        <Tabs data-testid="tabs" defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByTestId('tabs')).toBeInTheDocument();
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('shows correct content for default tab', () => {
      render(
        <Tabs defaultValue="tab2">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });

    it('includes data-slot attribute on root', () => {
      render(
        <Tabs data-testid="tabs" defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByTestId('tabs')).toHaveAttribute('data-slot', 'tabs');
    });
  });

  describe('Tab Switching', () => {
    it('switches content when tab is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      // Initially shows content 1
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      // Click tab 2
      await user.click(screen.getByText('Tab 2'));

      // Now shows content 2
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
          <Tabs.Content value="tab3">Content 3</Tabs.Content>
        </Tabs>
      );

      const tab1 = screen.getByText('Tab 1');
      const tab2 = screen.getByText('Tab 2');

      // Focus first tab
      await user.click(tab1);
      expect(tab1).toHaveFocus();

      // Navigate with arrow keys
      await user.keyboard('{ArrowRight}');
      expect(tab2).toHaveFocus();
    });
  });

  describe('Tabs.List', () => {
    it('renders with default styles', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List data-testid="tabs-list">
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content</Tabs.Content>
        </Tabs>
      );

      const tabsList = screen.getByTestId('tabs-list');
      expect(tabsList).toHaveClass(
        'bg-muted',
        'text-muted-foreground',
        'inline-flex',
        'h-9',
        'rounded-lg'
      );
    });

    it('applies custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List className="custom-list" data-testid="tabs-list">
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByTestId('tabs-list')).toHaveClass('custom-list');
    });

    it('includes data-slot attribute', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List data-testid="tabs-list">
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByTestId('tabs-list')).toHaveAttribute(
        'data-slot',
        'tabs-list'
      );
    });
  });

  describe('Tabs.Trigger', () => {
    it('renders with default styles', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger data-testid="tab-trigger" value="tab1">
              Tab 1
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content</Tabs.Content>
        </Tabs>
      );

      const trigger = screen.getByTestId('tab-trigger');
      expect(trigger).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-md',
        'text-sm',
        'font-medium'
      );
    });

    it('shows active state for selected tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger data-testid="active-tab" value="tab1">
              Active Tab
            </Tabs.Trigger>

            <Tabs.Trigger data-testid="inactive-tab" value="tab2">
              Inactive Tab
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      const activeTab = screen.getByTestId('active-tab');
      const inactiveTab = screen.getByTestId('inactive-tab');

      expect(activeTab).toHaveAttribute('data-state', 'active');
      expect(inactiveTab).toHaveAttribute('data-state', 'inactive');
    });

    it('applies custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger
              className="custom-trigger"
              data-testid="tab-trigger"
              value="tab1"
            >
              Tab 1
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByTestId('tab-trigger')).toHaveClass('custom-trigger');
    });

    it('includes data-slot attribute', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger data-testid="tab-trigger" value="tab1">
              Tab 1
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByTestId('tab-trigger')).toHaveAttribute(
        'data-slot',
        'tabs-trigger'
      );
    });
  });

  describe('Tabs.Content', () => {
    it('renders with default styles', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content data-testid="tab-content" value="tab1">
            Content
          </Tabs.Content>
        </Tabs>
      );

      const content = screen.getByTestId('tab-content');
      expect(content).toHaveClass('flex-1', 'outline-none');
    });

    it('applies custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content
            className="custom-content"
            data-testid="tab-content"
            value="tab1"
          >
            Content
          </Tabs.Content>
        </Tabs>
      );

      expect(screen.getByTestId('tab-content')).toHaveClass('custom-content');
    });

    it('shows correct content state', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content data-testid="active-content" value="tab1">
            Active Content
          </Tabs.Content>

          <Tabs.Content data-testid="inactive-content" value="tab2">
            Inactive Content
          </Tabs.Content>
        </Tabs>
      );

      const activeContent = screen.getByTestId('active-content');
      expect(activeContent).toHaveAttribute('data-state', 'active');
    });

    it('includes data-slot attribute', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content data-testid="tab-content" value="tab1">
            Content
          </Tabs.Content>
        </Tabs>
      );

      expect(screen.getByTestId('tab-content')).toHaveAttribute(
        'data-slot',
        'tabs-content'
      );
    });
  });

  describe('Controlled Tabs', () => {
    it('works as controlled component', async () => {
      const user = userEvent.setup();
      let currentValue = 'tab1';
      const handleValueChange = (value: string) => {
        currentValue = value;
      };

      const {rerender} = render(
        <Tabs onValueChange={handleValueChange} value={currentValue}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();

      await user.click(screen.getByText('Tab 2'));

      // Rerender with new value
      rerender(
        <Tabs onValueChange={handleValueChange} value="tab2">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List role="tablist">
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      const tabs = screen.getAllByRole('tab');
      const tabpanel = screen.getByRole('tabpanel');

      expect(tablist).toBeInTheDocument();
      expect(tabs).toHaveLength(2);
      expect(tabpanel).toBeInTheDocument();
    });
  });
});
