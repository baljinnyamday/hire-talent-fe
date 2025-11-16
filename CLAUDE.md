# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Synapse" - an AI-powered talent hiring platform landing page built with Next.js 15, React 19, TypeScript, and Tailwind CSS. The project features interactive 3D WebGL particle effects using React Three Fiber.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev
# or
pnpm dev

# Build for production with Turbopack
npm run build
# or
pnpm build

# Start production server
npm run start
# or
pnpm start

# Run ESLint
npm run lint
# or
pnpm lint
```

The dev server runs on http://localhost:3000

## Architecture

### Page Structure

This is a single-page landing page application with the following structure:

- **app/page.tsx**: Main page component that composes all sections in order:
  - Header (navigation)
  - Hero (with WebGL background)
  - Features
  - Testimonials
  - Pricing
  - Contact
  - Footer

- **app/layout.tsx**: Root layout with metadata and font setup (Geist Mono)

### Component Organization

- **app/**: Page-level section components (hero.tsx, features.tsx, testimonials.tsx, pricing.tsx, contact.tsx, footer.tsx)
- **components/**: Reusable components
  - `header.tsx`: Navigation header
  - `mobile-menu.tsx`: Mobile navigation menu
  - `logo.tsx`: Brand logo component
  - `pill.tsx`: Styled pill/badge component
  - `theme-provider.tsx`: Theme context provider
- **components/ui/**: shadcn/ui components (54 components from Radix UI)
- **components/gl/**: WebGL/Three.js components
  - `index.tsx`: Main GL canvas setup with Leva controls
  - `particles.tsx`: Particle system implementation
  - `shaders/`: GLSL shader files for visual effects
- **lib/**: Utility functions (utils.ts contains `cn` helper for className merging)
- **hooks/**: Custom React hooks
- **styles/**: Global CSS styles

### UI Framework

The project uses shadcn/ui (New York style) configured with:
- Tailwind CSS v4 with PostCSS
- RSC (React Server Components) enabled
- Lucide icons
- Path aliases: `@/components`, `@/lib`, `@/ui`, `@/hooks`

### WebGL/3D Graphics

The hero section features a sophisticated particle system built with:
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Helper components and utilities
- **Leva**: Debug controls for tweaking visual parameters (hidden in production via `<Leva hidden />`)
- **r3f-perf**: Performance monitoring for 3D scenes

The GL component accepts a `hovering` prop that triggers visual effects when users interact with the "Contact Us" button.

### Fonts

- **Geist Mono**: Primary monospace font loaded via next/font/google
- Custom "Sentient" font family referenced in CSS for headings

### TypeScript Configuration

- Path alias `@/*` maps to the root directory
- Strict mode enabled
- Target: ES2017
- Module resolution: bundler

## AI Workflow System

A comprehensive two-page system for managing and visualizing AI talent evaluations.

### Routes

**1. Workflows List Page: `/workflows`**
- Displays all evaluated candidates in a card-based layout
- Shows key metrics: overall score, resume/GitHub/project scores
- Status badges: Recommended, Interview Scheduled, Pending, Rejected
- Click any card to view detailed workflow visualization

**2. Workflow Detail Page: `/workflow/[id]`**
- Dynamic route showing detailed AI decision-making process for a specific candidate
- Interactive React Flow visualization with branching logic
- Multi-path decision tree demonstrating AI reasoning

### Features

**List Page:**
- Card-based layout with candidate summaries
- Color-coded status indicators
- Quick metrics overview (Resume, GitHub, Projects scored out of 10)
- Overall score prominently displayed
- Direct navigation to detailed workflow

**Detail Page:**
- **Multi-path branching logic**: Conditional nodes that route based on data availability
- **Parallel analysis**: GitHub activity analysis runs in parallel with portfolio discovery
- **Decision nodes**: Diamond-shaped nodes for yes/no decision points
- **Interactive details**: Click any node to see detailed AI reasoning, metrics, and evidence
- **Visual legend**: Explains node types and edge meanings
- **Back navigation**: Return to workflows list

### Workflow Structure
```
Job Description → Resume Analysis → Portfolio Check?
                                    ↓ NO (red)    ↓ YES
                              Auto-discover      Direct analysis
                              (GitHub scan)
                                    ↓
                                Parallel GitHub Activity Analysis (purple dashed)
                                    ↓
                              Skills Match Check? → Final Recommendation
```

### Data Management

- **lib/workflow-data.ts**: Contains sample candidate data and workflow generation functions
- `candidateWorkflows`: Array of candidate evaluations
- `getWorkflowById(id)`: Retrieve specific candidate data
- `getWorkflowNodes(id)`: Generate workflow nodes for a candidate
- `getWorkflowEdges()`: Generate workflow edges (connections)

### Components

**Workflow Components:**
- **WorkflowNode** (`components/workflow/WorkflowNode.tsx`): Standard analysis nodes
- **DecisionNode** (`components/workflow/DecisionNode.tsx`): Diamond-shaped conditional nodes
- **NodeDetailPanel** (`components/workflow/NodeDetailPanel.tsx`): Side panel for detailed reasoning
- **WorkflowLegend** (`components/workflow/WorkflowLegend.tsx`): Visual guide overlay

### Customization

To add new candidates:
1. Add candidate data to `candidateWorkflows` array in `lib/workflow-data.ts`
2. Workflow visualization will automatically generate based on candidate metrics
3. Update `getWorkflowNodes()` to customize node data based on candidate

To modify workflow structure:
- Edit node positions in `getWorkflowNodes()`
- Modify edge connections in `getWorkflowEdges()`
- Add new node types by creating components and registering in `nodeTypes`

## Key Integration Points

- The Hero section's GL component is tightly coupled with the "Contact Us" button hover state
- All section components are marked with id attributes for anchor navigation (#features, #testimonials, #pricing)
- Mobile responsiveness is handled throughout with Tailwind breakpoints (sm, md)
- Workflow page accessible via header navigation and mobile menu
