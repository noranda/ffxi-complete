# Contributing to FFXI Progress Tracker

Thank you for your interest in contributing to the FFXI Progress Tracker! This document provides guidelines and information for contributors.

## 🎯 Ways to Contribute

### 🐛 Bug Reports
- **Search existing issues** before creating new ones
- **Use the bug report template** with detailed reproduction steps
- **Include screenshots** for UI-related issues
- **Provide browser/OS information** for compatibility issues

### ✨ Feature Requests
- **Check the roadmap** to see if it's already planned
- **Use the feature request template** with clear use cases
- **Explain the problem** you're trying to solve
- **Consider implementation complexity** and maintenance burden

### 📝 Documentation
- **Fix typos** and improve clarity
- **Add examples** to existing documentation
- **Update outdated information**
- **Translate content** (if multilingual support is added)

### 🧪 Testing
- **Write tests** for new features
- **Improve test coverage** for existing code
- **Add edge case testing**
- **Performance testing** for large datasets

### 💻 Code Contributions
- **Bug fixes** with corresponding tests
- **New features** following our architecture
- **Performance improvements**
- **Accessibility enhancements**

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **Yarn** package manager
- **Git** for version control
- **VS Code** (recommended) with our extensions

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/ffxi-tracker.git
   cd ffxi-tracker
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up your development environment**
   ```bash
   # Copy VS Code settings (recommended)
   cp .vscode/settings.json.example .vscode/settings.json
   
   # Start development server
   yarn dev
   ```

4. **Verify your setup**
   ```bash
   # Run tests to ensure everything works
   yarn test:run
   
   # Check linting
   yarn lint
   
   # Verify TypeScript compilation
   yarn type-check
   ```

### First Contribution

1. **Find a good first issue** labeled `good-first-issue`
2. **Comment on the issue** to let others know you're working on it
3. **Create a feature branch** from `main`
4. **Make your changes** following our code standards
5. **Test your changes** thoroughly
6. **Submit a pull request**

## 📋 Development Workflow

### Branch Naming
Follow our [git workflow standards](.cursor/rules/fragments/process/git-workflow.mdc):

```bash
feat/feature-name        # New features
fix/bug-description      # Bug fixes
refactor/component-name  # Code refactoring
docs/documentation-update # Documentation changes
test/test-description    # Adding or updating tests
chore/maintenance-task   # Maintenance tasks
```

### Commit Messages
Use [Conventional Commits](https://conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Examples:**
```bash
feat: add character portrait picker
fix: resolve tab navigation keyboard accessibility
docs: update installation instructions
test: add unit tests for Button component
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Follow our [code standards](.cursor/rules/code-guidelines.mdc)
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   yarn test:run        # All tests pass
   yarn lint           # No linting errors
   yarn type-check     # No TypeScript errors
   yarn build          # Builds successfully
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feat/your-feature-name
   # Create PR on GitHub
   ```

## 🔧 Code Standards

### TypeScript Guidelines
- **Use strict TypeScript** configuration
- **Prefer `type` over `interface`** for object shapes
- **Define prop types** outside component definitions
- **Use proper typing** for all functions and variables

```typescript
// ✅ Good
type ButtonProps = {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({variant = 'primary', size = 'md', onClick}) => (
  <button className={buttonVariants({variant, size})} onClick={onClick}>
    Click me
  </button>
);
```

### React Component Standards
- **Use `React.FC`** with const arrow functions
- **Sort props alphabetically** in parameters and JSX
- **Use implicit return** for JSX-only components
- **Follow JSX formatting rules** for spacing and structure

```typescript
// ✅ Good - Implicit return for JSX-only
const SimpleCard: React.FC<SimpleCardProps> = ({children, className, title}) => (
  <div className={cn('card-base', className)}>
    <h3>{title}</h3>
    {children}
  </div>
);

// ✅ Good - Explicit return when logic is present
const ComplexCard: React.FC<ComplexCardProps> = ({data, loading}) => {
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="complex-card">
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

### Import Organization
Imports are automatically sorted by ESLint:

```typescript
// React imports first
import {useState, useEffect} from 'react';

// External packages
import {createClient} from '@supabase/supabase-js';

// Internal packages (@/ prefix)
import {Button} from '@/components/ui/button';

// Relative imports
import {formatDate} from '../utils/date';
```

### Styling Guidelines
- **Use tailwind-variants** for component styling
- **Follow design system** tokens and naming
- **Maintain accessibility** standards
- **Support responsive design**

```typescript
const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    },
    size: {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-11 px-8",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
```

## 🧪 Testing Guidelines

### Test Organization
- **Colocate tests** in `__tests__` folders
- **Test user behavior** not implementation details
- **Use descriptive test names**
- **Mock external dependencies**

```typescript
// Component tests
describe('Button', () => {
  it('should render with correct variant classes', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Test Coverage
- **Aim for 80%+ coverage** on new code
- **Test critical paths** thoroughly
- **Include edge cases** and error scenarios
- **Test accessibility** features

### Running Tests
```bash
yarn test          # Run tests in watch mode
yarn test:run      # Run tests once
yarn test:ui       # Run tests with UI
yarn coverage      # Generate coverage report
```

## 🎨 Design Guidelines

### UI/UX Principles
- **Collection-focused design** optimized for large datasets
- **Accessibility first** - WCAG 2.1 AA compliance
- **Mobile responsive** design patterns
- **Consistent visual hierarchy**

### Component Design
- **Reusable components** with clear APIs
- **Flexible styling** through variants
- **Proper state management**
- **Error handling** and loading states

## 🐛 Bug Report Guidelines

### Before Reporting
1. **Search existing issues** for duplicates
2. **Try latest version** to see if it's already fixed
3. **Check documentation** for expected behavior
4. **Test in different browsers** if UI-related

### Bug Report Template
```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Firefox]
- Version: [e.g. 1.0.0]
```

## ✨ Feature Request Guidelines

### Before Requesting
1. **Check the roadmap** for planned features
2. **Search existing requests** for similar ideas
3. **Consider implementation complexity**
4. **Think about maintenance burden**

### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How would you like this to work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Screenshots, mockups, or other context.
```

## 📞 Getting Help

### Communication Channels
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Code Reviews** - Pull request feedback

### Code Review Process
- **All PRs require review** before merging
- **Be respectful** in feedback
- **Focus on code quality** and maintainability
- **Test thoroughly** before approving

### Response Times
- **Bug reports**: 1-3 days
- **Feature requests**: 1 week
- **Pull requests**: 2-5 days
- **General questions**: 1-2 days

## 🏆 Recognition

### Contributors
All contributors are recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

### Types of Recognition
- **First-time contributors** get special mention
- **Significant features** credited in release notes
- **Bug fixes** acknowledged in issue closure
- **Documentation improvements** highlighted

## 📄 License

By contributing to FFXI Progress Tracker, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Your contributions help make FFXI Progress Tracker better for the entire community. Whether you're fixing a typo, reporting a bug, or adding a major feature, every contribution matters!

---

<div align="center">
  <strong>Happy Contributing! 🎮</strong>
</div> 