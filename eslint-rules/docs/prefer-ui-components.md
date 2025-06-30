# prefer-ui-components

Prefer internal UI components over raw HTML elements with styling.

## Rule Details

This rule enforces the use of standardized UI components instead of raw HTML elements that have inherent styling. This promotes consistency, maintainability, and accessibility across the codebase.

### Benefits of Using UI Components

- **Consistency**: All instances share the same styling and behavior
- **Maintainability**: Changes are made in one place
- **Accessibility**: Components include proper focus states and ARIA attributes
- **Type Safety**: Full TypeScript support with proper prop validation
- **Design System**: Automatically follows design tokens and variants

## Examples

### ❌ Incorrect

```jsx
// Typography elements
<h1>Page Title</h1>
<h2>Section Title</h2>
<p>Description text</p>

// Interactive elements
<button onClick={handleClick}>Click me</button>

// Form elements
<input type="text" placeholder="Enter text" />
<textarea placeholder="Enter description"></textarea>
<select><option>Choose</option></select>

// Content elements
<blockquote>Quote text</blockquote>
<code>inline code</code>
<pre>Code block</pre>

// UI lists (non-semantic)
<ul>
  <div>Item 1</div>
  <div>Item 2</div>
</ul>
```

### ✅ Correct

```jsx
// Use Typography component
<Typography variant="h1">Page Title</Typography>
<Typography variant="h2">Section Title</Typography>
<Typography variant="p">Description text</Typography>

// Use Button component
<Button onClick={handleClick}>Click me</Button>

// Use form components
<Input type="text" placeholder="Enter text" />
<Textarea placeholder="Enter description" />
<Select>
  <SelectItem>Choose</SelectItem>
</Select>

// Use appropriate content components
<Quote>Quote text</Quote>
<Code>inline code</Code>
<CodeBlock>Code block</CodeBlock>

// Use Card or custom components for UI
<Card>
  <CardContent>Item 1</CardContent>
  <CardContent>Item 2</CardContent>
</Card>

// Semantic HTML is still acceptable
<main>
  <nav>
    <a href="/home">Home</a>
  </nav>
  <section>
    <ul>
      <li>Semantic list item</li>
      <li>Another semantic item</li>
    </ul>
  </section>
</main>
```

## Restricted Elements

### Typography Elements

- `<h1>` → Use `Typography` component with `variant="h1"`
- `<h2>` → Use `Typography` component with `variant="h2"`
- `<h3>` → Use `Typography` component with `variant="h3"`
- `<h4>` → Use `Typography` component with `variant="h4"`
- `<h5>` → Use `Typography` component with `variant="h5"`
- `<h6>` → Use `Typography` component with `variant="h6"`
- `<p>` → Use `Typography` component with `variant="p"` or `Text` component

### Interactive Elements

- `<button>` → Use `Button` component from `@/components/ui/button`

### Form Elements

- `<input>` → Use `Input` component from `@/components/ui/input`
- `<textarea>` → Use `Textarea` component from `@/components/ui/textarea`
- `<select>` → Use `Select` component from `@/components/ui/select`

### Content Elements

- `<blockquote>` → Use `Quote` or `Card` component for quoted content
- `<code>` → Use `Code` component or `Badge` component for inline code
- `<pre>` → Use `CodeBlock` component for code blocks

### List Elements

- `<ul>` → Use `Card` or custom component for UI lists (semantic lists are OK)
- `<ol>` → Use `Card` or custom component for UI lists (semantic lists are OK)

## Exceptions

### Semantic HTML Elements (Always Allowed)

Elements used for semantic purposes are always allowed:

- `<main>`, `<nav>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`
- `<div>`, `<span>`, `<img>`, `<a>`, `<form>`, `<label>`
- `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`, `<th>`
- And other semantic elements

### Semantic Lists

Lists that contain proper `<li>` elements are considered semantic and allowed:

```jsx
✅ <ul><li>Item 1</li><li>Item 2</li></ul>
❌ <ul><div>Item 1</div><div>Item 2</div></ul>
```

### Elements with Semantic Attributes

Elements with ARIA attributes or semantic roles are allowed:

```jsx
✅ <div role="button">Custom button</div>
✅ <span aria-label="Close">×</span>
```

### Test Files

By default, the rule is relaxed in test files (`.test.`, `.spec.`, `__tests__`) to allow for easier testing scenarios.

## Configuration

### Options

```json
{
  "rules": {
    "@ffxi-tracker/prefer-ui-components": [
      "error",
      {
        "allowInTests": true,
        "additionalRestricted": {
          "strong": "Use Typography component with weight=\"bold\"",
          "em": "Use Typography component with style=\"italic\""
        }
      }
    ]
  }
}
```

- `allowInTests` (default: `true`): Whether to allow restricted elements in test files
- `additionalRestricted`: Object mapping element names to suggestion messages for additional restrictions

## When Raw HTML is Acceptable

Use raw HTML elements only when:

1. **No corresponding UI component exists**
2. **Semantic HTML is required** (e.g., `<main>`, `<nav>`, `<section>`)
3. **Component would add unnecessary complexity**
4. **Building the UI component itself**

Always consider creating a UI component if:

- Element appears multiple times across the codebase
- Element has complex styling or interactive states
- Element needs consistent behavior across usage

## Related Rules

- `prefer-cn-for-classname` - Ensures consistent className handling
- Component pattern guidelines in project documentation
