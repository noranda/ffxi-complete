import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import {Drawer} from '../drawer';

describe('Drawer Component', () => {
  describe('Basic Rendering', () => {
    it('renders drawer when open', () => {
      render(
        <Drawer open>
          <Drawer.Content data-testid="drawer-content">
            <Drawer.Header>
              <Drawer.Title>Test Drawer</Drawer.Title>
              <Drawer.Description>This is a test drawer</Drawer.Description>
            </Drawer.Header>
            <div>Drawer body content</div>
            <Drawer.Footer>
              <button>Close</button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
      expect(screen.getByText('Test Drawer')).toBeInTheDocument();
      expect(screen.getByText('This is a test drawer')).toBeInTheDocument();
      expect(screen.getByText('Drawer body content')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('does not render drawer when closed', () => {
      render(
        <Drawer open={false}>
          <Drawer.Content data-testid="drawer-content">
            <Drawer.Header>
              <Drawer.Title>Test Drawer</Drawer.Title>
              <Drawer.Description>This is a test drawer</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.queryByTestId('drawer-content')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Drawer')).not.toBeInTheDocument();
    });
  });

  describe('Drawer.Trigger', () => {
    it('opens drawer when trigger is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Drawer>
          <Drawer.Trigger data-testid="drawer-trigger">
            Open Drawer
          </Drawer.Trigger>
          <Drawer.Content data-testid="drawer-content">
            <Drawer.Header>
              <Drawer.Title>Test Drawer</Drawer.Title>
              <Drawer.Description>This is a test drawer</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      // Initially closed
      expect(screen.queryByTestId('drawer-content')).not.toBeInTheDocument();

      // Click trigger
      await user.click(screen.getByTestId('drawer-trigger'));

      // Should be open
      expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
      expect(screen.getByText('Test Drawer')).toBeInTheDocument();
    });

    it('applies custom className to trigger', () => {
      render(
        <Drawer>
          <Drawer.Trigger className="custom-trigger" data-testid="trigger">
            Open
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('trigger')).toHaveClass('custom-trigger');
    });

    it('includes data-slot attribute', () => {
      render(
        <Drawer>
          <Drawer.Trigger data-testid="trigger">Open</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('trigger')).toHaveAttribute(
        'data-slot',
        'drawer-trigger'
      );
    });
  });

  describe('Drawer.Content', () => {
    it('renders with default styles', () => {
      render(
        <Drawer open>
          <Drawer.Content data-testid="drawer-content">
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      const content = screen.getByTestId('drawer-content');
      expect(content).toHaveClass(
        'group/drawer-content',
        'bg-background',
        'fixed',
        'z-50',
        'flex',
        'flex-col'
      );
    });

    it('applies custom className', () => {
      render(
        <Drawer open>
          <Drawer.Content
            className="custom-content"
            data-testid="drawer-content"
          >
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-content')).toHaveClass(
        'custom-content'
      );
    });

    it('includes data-slot attribute', () => {
      render(
        <Drawer open>
          <Drawer.Content data-testid="drawer-content">
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-content')).toHaveAttribute(
        'data-slot',
        'drawer-content'
      );
    });
  });

  describe('Drawer.Header', () => {
    it('renders with default styles', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header data-testid="drawer-header">
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      const header = screen.getByTestId('drawer-header');
      expect(header).toHaveClass('flex', 'flex-col', 'p-4');
    });

    it('applies custom className', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header
              className="custom-header"
              data-testid="drawer-header"
            >
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-header')).toHaveClass('custom-header');
    });

    it('includes data-slot attribute', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header data-testid="drawer-header">
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-header')).toHaveAttribute(
        'data-slot',
        'drawer-header'
      );
    });
  });

  describe('Drawer.Title', () => {
    it('renders with default styles', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title data-testid="drawer-title">Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      const title = screen.getByTestId('drawer-title');
      expect(title).toHaveClass('text-foreground', 'font-semibold');
    });

    it('applies custom className', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title className="custom-title" data-testid="drawer-title">
                Title
              </Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-title')).toHaveClass('custom-title');
    });

    it('includes data-slot attribute', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title data-testid="drawer-title">Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-title')).toHaveAttribute(
        'data-slot',
        'drawer-title'
      );
    });
  });

  describe('Drawer.Description', () => {
    it('renders with default styles', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description data-testid="drawer-description">
                Description
              </Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      const description = screen.getByTestId('drawer-description');
      expect(description).toHaveClass('text-muted-foreground', 'text-sm');
    });

    it('applies custom className', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description
                className="custom-description"
                data-testid="drawer-description"
              >
                Description
              </Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-description')).toHaveClass(
        'custom-description'
      );
    });

    it('includes data-slot attribute', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description data-testid="drawer-description">
                Description
              </Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-description')).toHaveAttribute(
        'data-slot',
        'drawer-description'
      );
    });
  });

  describe('Drawer.Footer', () => {
    it('renders with default styles', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
            <Drawer.Footer data-testid="drawer-footer">Footer</Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      );

      const footer = screen.getByTestId('drawer-footer');
      expect(footer).toHaveClass('mt-auto', 'flex', 'flex-col', 'gap-2', 'p-4');
    });

    it('applies custom className', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
            <Drawer.Footer
              className="custom-footer"
              data-testid="drawer-footer"
            >
              Footer
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-footer')).toHaveClass('custom-footer');
    });

    it('includes data-slot attribute', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
            <Drawer.Footer data-testid="drawer-footer">Footer</Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-footer')).toHaveAttribute(
        'data-slot',
        'drawer-footer'
      );
    });
  });

  describe('Drawer.Close', () => {
    it('renders close button with proper attributes', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Test Drawer</Drawer.Title>
              <Drawer.Description>This is a test drawer</Drawer.Description>
            </Drawer.Header>
            <Drawer.Footer>
              <Drawer.Close data-testid="drawer-close">Close</Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      );

      const closeButton = screen.getByTestId('drawer-close');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('type', 'button');
      expect(closeButton).toHaveTextContent('Close');
    });

    it('applies custom className', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
            <Drawer.Footer>
              <Drawer.Close className="custom-close" data-testid="drawer-close">
                Close
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-close')).toHaveClass('custom-close');
    });

    it('includes data-slot attribute', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
            </Drawer.Header>
            <Drawer.Footer>
              <Drawer.Close data-testid="drawer-close">Close</Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-close')).toHaveAttribute(
        'data-slot',
        'drawer-close'
      );
    });
  });

  describe('Controlled Drawer', () => {
    it('works as controlled component', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      const {rerender} = render(
        <Drawer onOpenChange={handleOpenChange} open={false}>
          <Drawer.Trigger data-testid="drawer-trigger">Open</Drawer.Trigger>
          <Drawer.Content data-testid="drawer-content">
            <Drawer.Header>
              <Drawer.Title>Controlled Drawer</Drawer.Title>
              <Drawer.Description>
                This is a controlled drawer
              </Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      // Initially closed
      expect(screen.queryByTestId('drawer-content')).not.toBeInTheDocument();

      // Click trigger
      await user.click(screen.getByTestId('drawer-trigger'));
      expect(handleOpenChange).toHaveBeenCalledWith(true);

      // Rerender as open
      rerender(
        <Drawer onOpenChange={handleOpenChange} open={true}>
          <Drawer.Trigger data-testid="drawer-trigger">Open</Drawer.Trigger>
          <Drawer.Content data-testid="drawer-content">
            <Drawer.Header>
              <Drawer.Title>Controlled Drawer</Drawer.Title>
              <Drawer.Description>
                This is a controlled drawer
              </Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
    });
  });

  describe('Complete Drawer Structure', () => {
    it('renders complete drawer with all components', () => {
      render(
        <Drawer open>
          <Drawer.Content data-testid="complete-drawer">
            <Drawer.Header>
              <Drawer.Title>Complete Drawer</Drawer.Title>
              <Drawer.Description>
                This drawer has all components
              </Drawer.Description>
            </Drawer.Header>
            <div className="p-4">
              <p>Main drawer content goes here</p>
            </div>
            <Drawer.Footer>
              <Drawer.Close>Cancel</Drawer.Close>
              <button>Confirm</button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      );

      expect(screen.getByTestId('complete-drawer')).toBeInTheDocument();
      expect(screen.getByText('Complete Drawer')).toBeInTheDocument();
      expect(
        screen.getByText('This drawer has all components')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Main drawer content goes here')
      ).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('maintains proper component hierarchy', () => {
      render(
        <Drawer open>
          <Drawer.Content data-testid="drawer">
            <Drawer.Header data-testid="header">
              <Drawer.Title data-testid="title">Title</Drawer.Title>
              <Drawer.Description data-testid="description">
                Description
              </Drawer.Description>
            </Drawer.Header>
            <div data-testid="body">Body</div>
            <Drawer.Footer data-testid="footer">
              <Drawer.Close data-testid="close">Close</Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      );

      const drawer = screen.getByTestId('drawer');
      const header = screen.getByTestId('header');
      const footer = screen.getByTestId('footer');

      expect(drawer).toContainElement(header);
      expect(drawer).toContainElement(screen.getByTestId('body'));
      expect(drawer).toContainElement(footer);
      expect(header).toContainElement(screen.getByTestId('title'));
      expect(header).toContainElement(screen.getByTestId('description'));
      expect(footer).toContainElement(screen.getByTestId('close'));
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Drawer open>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Accessible Drawer</Drawer.Title>
              <Drawer.Description>This drawer is accessible</Drawer.Description>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-labelledby');
      expect(dialog).toHaveAttribute('aria-describedby');
    });
  });
});
