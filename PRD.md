# FFXI Progress Tracker – PRD

## 📌 Objective

Build a React-based web app that helps Final Fantasy XI players track their character progress across multiple
domains (jobs, spells, items, quests, etc.) with a persistent backend and potential for community collaboration. The
tool will support both manual tracking and preloaded game data, with future goals of automated character syncing.

## 🧩 Scope & Features

### Core Tracking Features

| Category            | Functionality                                                                  |
| ------------------- | ------------------------------------------------------------------------------ |
| Jobs                | Track current level per job                                                    |
| Crafts              | Track level and rank                                                           |
| Combat/Magic Skills | Track individual skill levels                                                  |
| Mog Garden          | Checklist for Cheers & Mementos                                                |
| Trusts              | Unlock checklist                                                               |
| Mounts              | Unlock checklist                                                               |
| BLU Spells          | Checklist with spell info, mobs, and acquisition data                          |
| Fame                | Fame level per region                                                          |
| Treasure Caskets    | Items collected per zone                                                       |
| Quests              | Track per quest: name, fame required, repeatable, items needed, rewards        |
| Missions            | Track storyline progress per expansion                                         |
| Items               | Taggable list with status and source (NPC, AH, Quest, etc.), with FFXIAH links |

## ⚙️ Technical Architecture

### Frontend

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: TailwindCSS v4 + shadcn + Radix
- **Routing**: react-router-dom with deep linking for collections
- **State Management**: React Context with collection-focused patterns
- **Testing**: React Testing Library
- **Storage**: Persistent (no localStorage-only solutions)
- **Design Pattern**: Collection-focused UI inspired by XIV-Complete with tab navigation, accordion lists, and progress indicators

### Backend (MVP Recommendation)

- **Stack**: Supabase
- **Database**: Postgres
- **Auth**: Supabase Auth (with email or Discord OAuth)
- Realtime sync, row-level security, and RESTful/GraphQL APIs
- Community-supported and frontend-friendly
- **Bonus**: Easily self-hostable later if needed
- **Versioning**: Changesets for data updates (e.g. new quests or items)

### Design Approach

The application follows a **collection-focused design pattern** inspired by [XIV-Complete](https://xiv-complete.com/), prioritizing:

- **Tab-based navigation** with progress indicators for each collection type
- **Vertical list layouts** with accordion expansion for detailed information
- **Prominent search and filtering** at the top of each collection
- **Visual progress indicators** throughout (completion ratios, progress bars, badges)
- **Clean, dark theme** optimized for data scanning and completionist workflows
- **Consistent interaction patterns** across all collection types
- **Responsive design** that works well on desktop, tablet, and mobile devices

This approach emphasizes **usability over complexity**, making it easy for players to quickly navigate between
different tracking categories, see their progress at a glance, and efficiently manage their completion goals.

### Data Sources

| Type                    | Source                         | Method                            |
| ----------------------- | ------------------------------ | --------------------------------- |
| Items, Spells, Trusts   | Windower resources/ repo       | Preprocessed JSON via script      |
| Quests, Missions, BLU   | BGWiki / FFXIclopedia          | Scraped or semi-manual data dumps |
| Extended item stats     | LandSandBoat SQL (optional)    | Future enrichment layer           |
| Character sync (future) | Windower Lua addon or EliteAPI | Optional upload/export            |

## 🚀 Development Workflow Breakdown

### Foundation Phase (MVP Core)

#### 1. Project Setup & Infrastructure

**Prompt**: "Create a foundational project setup for the FFXI Progress Tracker with Vite, React 19, TypeScript,
TailwindCSS v4, shadcn/ui, and Supabase integration. Include authentication, basic routing, and a clean project
structure following our code guidelines. Design the layout with a collection-focused approach inspired by
XIV-Complete: tab-based navigation at the top, progress indicators in tabs, and a dark theme with clean typography."

#### 2. Authentication & User Management

**Prompt**: "Build a complete authentication system for FFXI Progress Tracker using Supabase Auth with email/password
and Discord OAuth options. Include login, registration, password reset, and protected route functionality with proper
error handling."

#### 3. Character Management System

**Prompt**: "Create a character management system that allows users to create, edit, and select multiple FFXI
characters. Each character should have a name, server, and be linked to the authenticated user with proper data
persistence in Supabase."

### Core Tracking Phase (MVP Features)

#### 4. Jobs Tracking System

**Prompt**: "Build a comprehensive job tracking system for all FFXI jobs using the XIV-Complete design pattern.
Create a 'Jobs' tab with progress indicator (e.g., 'Jobs 15/22'), display jobs in a vertical list with accordion
expansion, include level input fields with progress bars, job icons, and search/filter functionality. Focus on clean,
scannable layout with completion states clearly visible."

#### 5. Crafts Tracking System

**Prompt**: "Create a crafting skills tracking system that allows users to track levels and ranks for all FFXI
crafting disciplines. Include level tracking (1-110+), rank progression, and skill point management with visual
progress indicators."

#### 6. Trusts Collection Tracker

**Prompt**: "Build a Trusts collection tracker following the XIV-Complete collection pattern. Create a 'Trusts' tab
with completion counter (e.g., 'Trusts 142/287'), display trusts in a vertical list with checkbox interactions,
include search bar and quick filters (All/Acquired/Unacquired), trust icons, and accordion expansion for detailed
info. Emphasize satisfying completion feedback and clear visual progress indicators."

### Enhanced Features Phase

#### 7. Combat & Magic Skills Tracker

**Prompt**: "Create a comprehensive skills tracking system for all FFXI combat and magic skills. Include skill level
tracking (0-500+), skill categories, progress visualization, and the ability to set skill level goals per character."

#### 8. Fame Tracking System

**Prompt**: "Build a fame tracking system for all FFXI regions and areas. Allow users to track fame levels (1-9)
across different regions, display fame requirements for unlocks, and show overall fame progression."

#### 9. BLU Spells Collection Manager

**Prompt**: "Create a Blue Mage spell collection tracker that displays all learnable spells with detailed information
including spell effects, learning methods, monster sources, and location data. Include search, filtering, and spell
set management features."

### Advanced Features Phase

#### 10. Mog Garden Tracker

**Prompt**: "Build a Mog Garden tracking system for Cheers and Mementos collection. Create checklists for all
collectible items, organize by categories, and include completion tracking with visual progress indicators."

#### 11. Mounts Collection Tracker

**Prompt**: "Create a comprehensive mounts collection system that tracks all obtainable mounts in FFXI. Include mount
categories, acquisition methods, requirements, and visual collection progress with search and filter capabilities."

#### 12. Quest Management System

**Prompt**: "Build a quest tracking system that allows users to track quest completion, requirements, rewards, and
fame prerequisites. Include quest search, filtering by expansion/type, and detailed quest information display."

### Polish & Enhancement Phase

#### 13. Missions Progress Tracker

**Prompt**: "Create a mission tracking system for all FFXI storylines and expansions. Track mission completion
status, display mission progression trees, and show requirements and rewards for each mission."

#### 14. Items & Inventory Management

**Prompt**: "Build an item tagging and tracking system where users can mark items as obtained, needed, or targeted.
Include item search with FFXIAH integration, custom tagging, filtering by source (NPC, AH, Quest), and wishlist management."

#### 15. Dashboard & Analytics

**Prompt**: "Create a comprehensive user dashboard that provides an overview of all tracked progress using the tab-based
navigation pattern. The dashboard should be the default/home tab showing: completion statistics for each collection, recent
activity feed, progress charts, achievement highlights, and personalized recommendations. Include quick navigation to
specific collections and maintain the clean, scannable visual hierarchy established in other tabs."

### Community & Advanced Features Phase

#### 16. Data Import/Export System

**Prompt**: "Build data import/export functionality that allows users to backup their progress, share character data, and
potentially import data from external sources. Include JSON export, data validation, and user-friendly import interfaces."

#### 17. Multi-Character Comparison

**Prompt**: "Create tools for comparing progress across multiple characters, viewing aggregate statistics, and managing
progress for users with multiple FFXI characters. Include side-by-side comparisons and progress transfer options."

#### 18. Community Features & Social Integration

**Prompt**: "Add community features including progress sharing, leaderboards, achievement showcases, and the ability to
follow other players' progress. Include privacy controls and optional social features."

## 🔜 Roadmap

### Phase 1: MVP

- Setup base React app structure
- Build JSON data loaders (jobs, trusts, spells)
- Set up Supabase project with Postgres + Auth
- Build Tracker UI for:
  - Jobs
  - Crafts
  - Trusts
- Save and persist progress to Supabase per user
- Add responsive layout and theme

### Phase 2: Expanded Tracking

- Add Fame, Skill, Mog Garden, BLU Spells
- Add Quests + Missions (using scraped data)
- Add Item tagging system with filters

### Phase 3: Community & Automation

- Add basic user dashboard and multi-character support
- Allow optional data upload/export via Windower or EliteAPI
- Enable community tagging and data suggestions via GitHub PRs
- Add admin tools to review/merge changeset updates

## 📈 Success Metrics

- ✅ App reliably tracks and persists progress across sessions and logins
- ✅ Users can filter/search BLU spells, items, quests
- ✅ New data is easily added and versioned
- ✅ Other players can create accounts and use it with their own characters

## 🤝 Open Source Vision

- GitHub repo will be public from the start
- Contributions encouraged via Issues + PRs
- Game data managed in a `/data` directory with changesets to version updates
- Auto-deploy via Vercel on main branch
