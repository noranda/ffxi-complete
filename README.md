# FFXI Progress Tracker

A modern web application for tracking your Final Fantasy XI character progression, collections, and achievements. Built with React 19, TypeScript, and TailwindCSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-101%20passing-green.svg)](https://vitest.dev/)

## ✨ Features

### 📊 Character Progression
- **Job Level Tracking** - Track all 22 jobs with experience and level progression
- **Skill Monitoring** - Combat, magic, and crafting skill progression
- **Merit Point Management** - Track merit point allocations and builds

### 🎯 Collection Tracking
- **Trust Collection** - Track all 287 available Trust NPCs
- **Mount Collection** - Monitor chocobo and other mount acquisitions
- **Key Item Library** - Comprehensive key item checklist
- **Equipment Sets** - Track gear sets and equipment progression

### 🗺️ Content Completion
- **Mission Progress** - Track story missions across all expansions
- **Quest Completion** - Comprehensive quest tracking system
- **Achievement Hunting** - Monitor Records of Eminence and other achievements

### 🔧 Quality of Life
- **Multi-Character Support** - Manage multiple FFXI characters
- **Data Export/Import** - Backup and share your progress data
- **Dark/Light Themes** - Customizable interface themes
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **Yarn** package manager
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ffxi-tracker.git
cd ffxi-tracker

# Install dependencies
yarn install

# Start development server
yarn dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Development
yarn dev          # Start development server with HMR
yarn build        # Build for production
yarn preview      # Preview production build locally

# Code Quality
yarn lint         # Run ESLint
yarn lint:fix     # Fix auto-fixable ESLint issues
yarn format       # Format code with Prettier
yarn type-check   # Run TypeScript compiler

# Testing
yarn test         # Run tests in watch mode
yarn test:run     # Run tests once
yarn test:ui      # Run tests with UI
yarn coverage     # Generate test coverage report

# Utilities
yarn clean        # Clean build artifacts
yarn clean:install # Clean install dependencies
```

## 🏗️ Tech Stack

### Frontend
- **[React 19](https://react.dev/)** - UI library with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[TailwindCSS v4](https://tailwindcss.com/)** - Utility-first CSS framework

### UI Components
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[tailwind-variants](https://www.tailwind-variants.org/)** - Component styling variants

### Backend (Planned)
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Data protection and user isolation

### Development Tools
- **[Vitest](https://vitest.dev/)** - Fast unit test framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing utilities
- **[ESLint](https://eslint.org/)** - Code linting and quality
- **[Prettier](https://prettier.io/)** - Code formatting

## 🧪 Testing

The project maintains comprehensive test coverage with **101 passing tests** covering:

- **UI Components** - All shadcn/ui components with full interaction testing
- **User Interactions** - Form handling, navigation, and accessibility
- **Integration Tests** - Component composition and data flow
- **Type Safety** - TypeScript compilation and type checking

```bash
# Run all tests
yarn test

# Generate coverage report
yarn coverage

# Run tests with UI
yarn test:ui
```

## 🎨 Design Philosophy

Inspired by [XIV-Complete](https://xiv-complete.com), the FFXI Progress Tracker emphasizes:

- **Collection-Focused UI** - Optimized for tracking large datasets
- **Quick Navigation** - Tab-based interface with progress indicators
- **Visual Progress** - Clear completion states and progress bars
- **Accessibility First** - WCAG 2.1 AA compliant interface
- **Mobile Responsive** - Touch-friendly design for all devices

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui component library
│   ├── auth/           # Authentication components
│   ├── character/      # Character management
│   ├── collections/    # Collection tracking
│   └── layout/         # Layout and navigation
├── hooks/              # Custom React hooks
├── pages/              # Page components and routing
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
├── data/               # Static FFXI game data
└── assets/             # Images and static resources
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Follow** our [code standards](.cursor/rules/code-guidelines.mdc)
4. **Write** tests for new functionality
5. **Commit** using [conventional commits](https://conventionalcommits.org/)
6. **Push** to your branch (`git push origin feat/amazing-feature`)
7. **Open** a Pull Request

### Code Standards

- **TypeScript** strict mode with comprehensive type safety
- **ESLint + Prettier** for consistent code formatting
- **Test-Driven Development** with Vitest and RTL
- **Accessibility** testing and WCAG compliance
- **Performance** optimization and bundle analysis

## 📋 Roadmap

### Phase 1.0 - Foundation ✅
- [x] React 19 + TypeScript setup
- [x] TailwindCSS v4 + shadcn/ui integration
- [x] Comprehensive testing infrastructure
- [x] Development environment optimization
- [x] Code standards and documentation

### Phase 2.0 - Backend Integration 🚧
- [ ] Supabase setup and configuration
- [ ] User authentication system
- [ ] Database schema design
- [ ] API integration layer

### Phase 3.0 - Character Management
- [ ] Character creation and management
- [ ] Job level tracking system
- [ ] Skill progression monitoring
- [ ] Merit point allocation

### Phase 4.0 - Collection Systems
- [ ] Trust collection tracking
- [ ] Mount and pet management
- [ ] Key item checklist
- [ ] Equipment set tracking

### Phase 5.0 - Content Tracking
- [ ] Mission progress system
- [ ] Quest completion tracking
- [ ] Achievement monitoring
- [ ] Records of Eminence integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Square Enix** for Final Fantasy XI
- **FFXI Community** for data and inspiration
- **Open Source Community** for the amazing tools and libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/ffxi-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ffxi-tracker/discussions)

---

<div align="center">
  <strong>Built with ❤️ for the FFXI community</strong>
</div>
