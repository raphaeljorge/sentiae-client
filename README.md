# Sentiae Client

A modern React application built with TanStack Router, React Query, and React Flow for AI workflow management.

## Features

### Workflow Editor Integration
- **Visual Workflow Editor**: Built with React Flow for creating and editing AI workflows
- **Example Workflows**: Four pre-built workflow examples demonstrating different patterns:
  - **Chain Workflow**: Step-by-step content creation with quality checks
  - **Routing Workflow**: Content classification and specialist routing  
  - **Parallelization Workflow**: Parallel exam creation with aggregation
  - **Orchestrator Workflow**: Coordinated development task distribution

### API Integration
- **MSW Mocking**: Mock Service Worker for API simulation during development
- **React Query**: Data fetching, caching, and state management
- **Workflow API**: RESTful endpoints for workflow CRUD operations

### Technical Stack
- **TanStack Router**: File-based routing with type safety
- **React Flow**: Interactive node-based workflow editor
- **Zustand**: Lightweight state management for workflow execution
- **Shadcn/ui**: Modern UI component library
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
```bash
npm install
# or
pnpm install
```

### Development
```bash
npm run dev
# or
pnpm dev
```

### Build
```bash
npm run build
# or
pnpm build
```

## Using the Workflow Editor

### Accessing the Editor
1. Start the development server
2. Navigate to the home page (`/`)
3. Click on any workflow example card to open it in the editor
4. Or directly access via URL: `/editor?id=flow-chain`

### Available Workflow IDs
- `flow-chain` - Chain Workflow example
- `flow-routing` - Routing Workflow example  
- `flow-parallelization` - Parallelization Workflow example
- `flow-orchestrator` - Orchestrator Workflow example

### Editor Features
- **Visual Node Editor**: Drag and drop workflow nodes
- **Real-time Updates**: Live workflow validation and state management
- **Execution Engine**: Run workflows with SSE-based progress tracking
- **Multiple Node Types**:
  - Text Input nodes for user input
  - Generate Text nodes for AI processing
  - Visualize Text nodes for output display
  - Prompt Crafter nodes for dynamic prompt building

### API Structure

The workflow API is mocked using MSW and provides:

```typescript
// Get all workflows
GET /api/workflows

// Get specific workflow  
GET /api/workflows/:id

// External URLs (for compatibility)
GET https://simple-ai.dev/r/flow-*.json
```

### Workflow Definition Structure

```typescript
interface WorkflowDefinition {
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport?: {
    x: number;
    y: number; 
    zoom: number;
  };
}
```

## Project Structure

```
src/
├── components/           # Reusable UI components
├── entities/            # Domain entities
├── features/            # Feature-specific code
├── flow/               # Flow-related utilities
├── mocks/              # MSW mock handlers and data
│   ├── browser.ts      # MSW browser setup
│   ├── handlers/       # API route handlers
│   └── data/          # Mock workflow definitions
├── pages/              # Page components
│   └── editor/        # Workflow editor page
├── routes/             # TanStack Router routes
├── shared/             # Shared utilities and components
│   ├── api/           # API service functions
│   ├── hooks/         # React Query hooks
│   ├── lib/           # Utility libraries
│   ├── types/         # TypeScript type definitions
│   └── ui/            # UI component library
└── widgets/            # Complex UI widgets
    └── flow-editor/    # Main workflow editor widget
```

## Architecture

### Feature-Sliced Design
The project follows Feature-Sliced Design (FSD) principles:
- **Shared**: Reusable code across features
- **Entities**: Business entities and their logic
- **Features**: Specific functionality implementations
- **Widgets**: Complex UI compositions
- **Pages**: Route-level components

### State Management
- **React Query**: Server state management and caching
- **Zustand**: Client-side workflow execution state
- **TanStack Router**: URL state management

### Component Architecture
- **Controller Pattern**: Separate business logic from presentation
- **Composition**: Small, focused components
- **Type Safety**: Full TypeScript coverage

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run Biome linter
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking
5. Submit a pull request

## License

MIT License - see LICENSE file for details
