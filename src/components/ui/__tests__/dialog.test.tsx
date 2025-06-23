/**
 * Dialog Component Tests
 *
 * Comprehensive test suite for the Dialog component covering:
 * - Component rendering and structure
 * - Accessibility features
 * - User interactions
 * - Keyboard navigation
 * - Props handling
 */

import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import {Dialog} from '../dialog';

describe('Dialog', () => {
  describe('Component Structure', () => {
    it('should render dialog with trigger and content', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Test Dialog</Dialog.Title>
              <Dialog.Description>This is a test dialog</Dialog.Description>
            </Dialog.Header>
            <div>Dialog body content</div>

            <Dialog.Footer>
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      );

      const trigger = screen.getByRole('button', {name: /open dialog/i});
      expect(trigger).toBeInTheDocument();

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Test Dialog')).toBeInTheDocument();
        expect(screen.getByText('This is a test dialog')).toBeInTheDocument();
        expect(screen.getByText('Dialog body content')).toBeInTheDocument();
      });
    });

    it('should render dialog with proper data-slot attributes', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger data-testid="trigger">Open</Dialog.Trigger>

          <Dialog.Content data-testid="content">
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('data-slot', 'dialog-trigger');

      await user.click(trigger);

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-slot', 'dialog-content');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Title>Accessible Dialog</Dialog.Title>
            <Dialog.Description>Dialog description</Dialog.Description>
          </Dialog.Content>
        </Dialog>
      );

      await user.click(screen.getByRole('button', {name: /open dialog/i}));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute('aria-labelledby');
        expect(dialog).toHaveAttribute('aria-describedby');
      });
    });

    it('should support screen reader text for close button', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Title>Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      await user.click(screen.getByRole('button', {name: /open/i}));

      await waitFor(() => {
        const closeButton = screen.getByRole('button', {name: /close/i});
        expect(closeButton).toBeInTheDocument();
        expect(closeButton.querySelector('.sr-only')).toHaveTextContent('Close');
      });
    });
  });

  describe('User Interactions', () => {
    it('should open dialog when trigger is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', {name: /open dialog/i}));

      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    });

    it('should close dialog when close button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      await user.click(screen.getByRole('button', {name: /open dialog/i}));

      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

      const closeButton = screen.getByRole('button', {name: /close/i});
      await user.click(closeButton);

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should close dialog when custom close button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Close>Custom Close</Dialog.Close>
          </Dialog.Content>
        </Dialog>
      );

      await user.click(screen.getByRole('button', {name: /open dialog/i}));

      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

      await user.click(screen.getByRole('button', {name: /custom close/i}));

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should close dialog when escape key is pressed', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      await user.click(screen.getByRole('button', {name: /open dialog/i}));

      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

      await user.keyboard('{Escape}');

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should close dialog when clicking outside', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Dialog>
            <Dialog.Trigger>Open Dialog</Dialog.Trigger>

            <Dialog.Content>
              <Dialog.Title>Test Dialog</Dialog.Title>
            </Dialog.Content>
          </Dialog>
          <div data-testid="outside">Outside content</div>
        </div>
      );

      await user.click(screen.getByRole('button', {name: /open dialog/i}));

      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

      // Click on the overlay (outside the dialog content)
      const overlay = document.querySelector('[data-slot="dialog-overlay"]');
      if (overlay) {
        await user.click(overlay);
      }

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });
  });

  describe('Controlled Usage', () =>
    it('should support controlled open state', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      const {rerender} = render(
        <Dialog onOpenChange={onOpenChange} open={false}>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Title>Controlled Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', {name: /open dialog/i}));
      expect(onOpenChange).toHaveBeenCalledWith(true);

      rerender(
        <Dialog onOpenChange={onOpenChange} open={true}>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Title>Controlled Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    }));

  describe('Custom Content', () => {
    it('should render dialog without close button when showCloseButton is false', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>

          <Dialog.Content showCloseButton={false}>
            <Dialog.Title>No Close Button</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      await user.click(screen.getByRole('button', {name: /open dialog/i}));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.queryByRole('button', {name: /close/i})).not.toBeInTheDocument();
      });
    });

    it('should render complex dialog content structure', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger>Open Complex Dialog</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Complex Dialog</Dialog.Title>
              <Dialog.Description>This dialog has multiple sections</Dialog.Description>
            </Dialog.Header>

            <div>
              <div>Main content area</div>
              <input placeholder="Form input" />
            </div>

            <Dialog.Footer>
              <Dialog.Close>Cancel</Dialog.Close>
              <button type="button">Save</button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      );

      await user.click(screen.getByRole('button', {name: /open complex dialog/i}));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Complex Dialog')).toBeInTheDocument();
        expect(screen.getByText('This dialog has multiple sections')).toBeInTheDocument();
        expect(screen.getByText('Main content area')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Form input')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /cancel/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /save/i})).toBeInTheDocument();
      });
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply custom className to dialog content', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>

          <Dialog.Content className="custom-dialog-class" data-testid="content">
            <Dialog.Title>Styled Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );

      await user.click(screen.getByRole('button', {name: /open/i}));

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveClass('custom-dialog-class');
      });
    });

    it('should apply custom className to dialog components', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <Dialog.Trigger>Open</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Header className="custom-header">
              <Dialog.Title className="custom-title">Title</Dialog.Title>
              <Dialog.Description className="custom-description">Description</Dialog.Description>
            </Dialog.Header>

            <Dialog.Footer className="custom-footer">
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      );

      await user.click(screen.getByRole('button', {name: /open/i}));

      await waitFor(() => {
        expect(screen.getByText('Title').closest('[data-slot="dialog-header"]')).toHaveClass('custom-header');
        expect(screen.getByText('Title')).toHaveClass('custom-title');
        expect(screen.getByText('Description')).toHaveClass('custom-description');
        // Find the close button specifically in the footer by checking its parent
        const footerCloseButton = screen
          .getAllByRole('button', {name: /close/i})
          .find(button => button.closest('[data-slot="dialog-footer"]'));
        expect(footerCloseButton?.closest('[data-slot="dialog-footer"]')).toHaveClass('custom-footer');
      });
    });
  });
});
