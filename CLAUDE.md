# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FFXI Complete is a modern web application for tracking Final Fantasy XI character progression, collections, and
achievements. Built with React 19, TypeScript, TailwindCSS, and Supabase for backend services.

**Key Features:**

- Character progression tracking (22 jobs, skills, merit points)
- Collection tracking (Trusts, mounts, key items, equipment)
- Content completion tracking (missions, quests, achievements)
- Multi-character support with privacy controls
- Data export/import capabilities

## Common Development Commands

### Development

```bash
yarn dev          # Start development server (localhost:5173)
yarn build        # Build for production with TypeScript compilation
yarn preview      # Preview production build locally
```

### Code Quality (CRITICAL - Always run before commits)

```bash
yarn quality-check    # Complete quality pipeline: lint, format, test, build
yarn lint            # Run ESLint
yarn lint:fix        # Fix auto-fixable ESLint issues
yarn format          # Format code with Prettier
yarn type-check      # Run TypeScript compiler without emitting
```

### Testing

```bash
yarn test           # Run tests in watch mode
yarn test:run       # Run tests once
yarn test:coverage  # Generate test coverage report
yarn test:ui        # Run tests with UI interface
```

### Custom ESLint Rules Management

```bash
yarn maintain:rules     # Complete rules validation pipeline
yarn test:rules         # Test custom ESLint rules
yarn validate:rules     # Validate rule structure and syntax
yarn build:rules        # Build and validate rules for production
```

### Utilities

```bash
yarn clean             # Clean build artifacts and cache
yarn clean:install     # Clean reinstall of dependencies
```

## Architecture & Structure

### Frontend Stack

- **React 19** with concurrent features and new hooks
- **TypeScript 5.8** in strict mode with comprehensive type safety
- **Vite 6** for fast development and optimized builds
- **TailwindCSS v4** with utility-first approach
- **shadcn/ui** components built on Radix UI primitives

### Backend Architecture

- **Supabase** as Backend-as-a-Service with PostgreSQL
- **Row Level Security (RLS)** for multi-tenant data isolation
- **Real-time subscriptions** for live data updates
- **Structured migrations** with comprehensive documentation

### Database Schema

Key tables and relationships:

- `characters` → `character_progress` (flexible key-value progress tracking)
- `characters` → `character_job_progress` (job-specific leveling)
- `characters` → `character_skill_progress` (skill advancement)
- Privacy controls with public/private character sharing
- JSONB metadata for extensible progress data

### Component Architecture

```text
src/components/
├── ui/           # shadcn/ui base components with tailwind-variants
├── auth/         # Authentication & user management
├── character/    # Character creation & management
├── collections/  # Collection tracking features
└── layout/       # App structure & navigation
```

### Testing Strategy

- **Co-located tests** in `__tests__` directories
- **101+ passing tests** with comprehensive coverage
- **Vitest** for unit testing with React Testing Library
- **User interaction testing** with @testing-library/user-event
- **Accessibility testing** built into component tests

### Key Development Patterns

#### Type Safety

- Strict TypeScript configuration with comprehensive error checking
- Database types auto-generated from Supabase schema
- Component prop interfaces with detailed documentation
- Custom hooks with proper type inference

#### Styling with tailwind-variants

```typescript
import {tv} from 'tailwind-variants';

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      outline: 'border-input bg-background border',
    },
  },
});
```

#### Custom ESLint Rules

The project includes custom ESLint rules for:

- Import/export optimization (`no-duplicate-imports`)
- TypeScript patterns (`prefer-type-imports`)
- Component patterns (`prefer-cn-for-classname`)
- Redundant prop removal (`no-redundant-default-props`)

#### Authentication Context

Centralized auth state management with Supabase:

```typescript
const {user, signIn, signOut, loading} = useAuth();
```

## Development Guidelines

### Code Standards

- **ESLint + Prettier** enforced with pre-commit hooks
- **TailwindCSS** for styling with design system consistency
- **Accessibility-first** development with WCAG 2.1 AA compliance
- **Performance optimization** with bundle analysis

### Cursor Rules Integration

The project uses comprehensive Cursor rules stored in `.cursor/rules/`:

- Golden Rules for development principles
- Code guidelines with fragment-based organization
- Workflow systems for feature development and quality checks
- Educational focus with detailed commenting in database migrations

### Git Workflow

- **Conventional commits** with semantic prefixes
- **Feature branches** with descriptive names
- **Comprehensive PR reviews** following code standards
- **Quality gates** requiring all tests to pass

### Database Development

- **Educational migrations** with extensive commenting
- **Row Level Security** patterns for user data isolation
- **Performance indexes** on frequently queried columns
- **JSONB metadata** for flexible data structures

## Project-Specific Context

### FFXI Domain Knowledge

The application tracks complex FFXI progression systems:

- **22 Jobs** with main/sub levels, job points, and master levels
- **Multiple skill categories** (weapon, magic, craft) with caps
- **Trust NPCs** collection (287 available)
- **Privacy controls** for character sharing

### Asset Management

- Character portraits organized by race/gender/face/hair combinations
- Static game data in JSON format for seeding
- Image optimization with Sharp for portrait processing

### Quality Assurance

- **101+ tests** covering UI components and user interactions
- **Coverage reporting** with exclusions for config files
- **Performance monitoring** with bundle size tracking
- **Accessibility testing** integrated into component tests

## Important Notes

### Before Making Changes

1. **Always run `yarn quality-check`** before committing
2. **Review Cursor rules** in `.cursor/rules/` for project standards
3. **Test accessibility** with screen readers and keyboard navigation
4. **Verify database changes** don't break RLS policies

### When Adding Features

1. **Write tests first** following TDD principles
2. **Use existing patterns** from similar components
3. **Follow TypeScript strict mode** requirements
4. **Consider database performance** implications

### Common Gotchas

- **Supabase RLS policies** require careful user context handling
- **TailwindCSS v4** has different syntax than v3
- **React 19** concurrent features may affect timing in tests
- **Custom ESLint rules** are actively maintained and tested
