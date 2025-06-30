# no-redundant-default-props

## Description

Removes redundant prop usage in JSX when the prop value matches the component's default value.
For example, converts `<Button variant="default">` to `<Button>` when 'default' is the default value.

**Category:** Code Quality

## Rule Details

This rule detects when JSX props are explicitly set to their default values and removes them to reduce
code verbosity. It uses a predefined list of known redundant default values for common component props.

## Examples

### ❌ Bad

```javascript
// Explicitly setting default values
<Button variant="default" size="medium" />

// Boolean props set to their defaults
<Input required={false} disabled={false} />

// Numeric props with default values
<Card padding={16} />
```

### ✅ Good

```javascript
// Relying on default values
<Button />

// Only non-default values specified
<Button variant="primary" size="large" />

// Clean component usage
<Input placeholder="Enter text..." />
```

## Configuration

```javascript
{
  "local-rules/no-redundant-default-props": ["error", {
    "redundantDefaults": {
      "variant": "default",
      "size": "default",
      "asChild": false
    }
  }]
}
```

### Options

- `redundantDefaults` (default: `{asChild: false, size: "default", variant: "default"}`): Object mapping prop names to
  their redundant default values

## When To Use

Use this rule when you want to:

- Reduce visual clutter in JSX components
- Make component usage more concise
- Rely on well-defined component default values
- Maintain cleaner component interfaces

## Implementation

This rule is auto-fixable and will automatically remove redundant props that match the configured default
values. It checks literal values against the predefined list of redundant defaults.

For more details, see the main [README.md](../README.md).
