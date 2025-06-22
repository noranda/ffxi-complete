import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import {Input} from '../input';

describe('Input', () => {
  it('renders input with default styles', () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex', 'h-9', 'w-full', 'rounded-md', 'border', 'border-input', 'px-3');
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-input');
  });

  it('forwards additional props', () => {
    render(<Input data-testid="input" placeholder="Enter text" type="email" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('handles value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input data-testid="input" onChange={handleChange} />);
    const input = screen.getByTestId('input');

    await user.type(input, 'test value');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test value');
  });

  it('can be disabled', () => {
    render(<Input data-testid="input" disabled />);
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });

  it('supports different input types', () => {
    const {rerender} = render(<Input data-testid="input" type="password" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');

    rerender(<Input data-testid="input" type="email" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');

    rerender(<Input data-testid="input" type="number" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(<Input data-testid="input" onBlur={handleBlur} onFocus={handleFocus} />);
    const input = screen.getByTestId('input');

    await user.click(input);
    expect(handleFocus).toHaveBeenCalledOnce();

    await user.tab();
    expect(handleBlur).toHaveBeenCalledOnce();
  });

  it('supports controlled input', () => {
    const {rerender} = render(<Input data-testid="input" onChange={() => {}} value="initial" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveValue('initial');

    rerender(<Input data-testid="input" onChange={() => {}} value="updated" />);
    expect(input).toHaveValue('updated');
  });

  it('supports uncontrolled input with defaultValue', () => {
    render(<Input data-testid="input" defaultValue="default text" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveValue('default text');
  });

  it('applies focus styles correctly', async () => {
    const user = userEvent.setup();
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input');

    await user.click(input);
    expect(input).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50');
  });

  it('handles required attribute', () => {
    render(<Input data-testid="input" required />);
    const input = screen.getByTestId('input');
    expect(input).toBeRequired();
  });

  it('handles readonly attribute', () => {
    render(<Input data-testid="input" readOnly />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('readonly');
  });

  it('supports aria attributes for accessibility', () => {
    render(<Input aria-describedby="help-text" aria-invalid="true" aria-label="Test input" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-label', 'Test input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'help-text');
    expect(input).toHaveClass('aria-invalid:border-destructive');
  });

  it('includes data-slot attribute', () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('data-slot', 'input');
  });

  it('applies background and text styling', () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('bg-transparent', 'text-base');
  });
});
