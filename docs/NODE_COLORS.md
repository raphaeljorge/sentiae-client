# Dynamic Node Color System

This document explains how the dynamic node color system works in the Sentiae workflow editor.

## Overview

The node color system automatically generates border colors, hover effects, and shadows based on the `ui.color` property defined in each node's JSON definition. This eliminates the need for hardcoded color mappings and makes the system scalable for thousands of node types.

## How It Works

### 1. Node Definition Structure

Each node type defines its color in the JSON definition:

```typescript
{
  id: 'core/text-input',
  name: 'Text Input',
  ui: {
    color: '#06b6d4', // Hex color for the node
    icon: 'PenLine',
    width: 250,
  },
  // ... other properties
}
```

### 2. Dynamic Color Generation

The system uses three main functions to generate colors dynamically:

- **`getNodeBorderColor(nodeType, nodeDefinition)`**: Generates the default border color
- **`getNodeHoverBorderColor(nodeType, nodeDefinition)`**: Generates the hover border color (lighter shade)
- **`getNodeHoverShadowColor(nodeType, nodeDefinition)`**: Generates the hover shadow color (outward-growing effect)

### 3. Color Conversion Process

1. **Hex to Tailwind**: Converts hex colors to the closest Tailwind color name
2. **Border Colors**: Uses `border-{color}-500` for default, `border-{color}-400` for hover
3. **Shadow Colors**: Converts hex to RGB and creates a box-shadow with 50% opacity

## Usage

### In Node Components

```typescript
import { BaseNode } from '@/shared/ui/flow/base-node';

export function MyNode({ selected, nodeType, nodeDefinition, ...props }) {
  return (
    <BaseNode
      selected={selected}
      nodeType={nodeType}
      nodeDefinition={nodeDefinition} // Pass the node definition
      className="custom-classes"
    >
      {/* Node content */}
    </BaseNode>
  );
}
```

### In Generic Node Controller

The `GenericNodeController` automatically passes the node definition:

```typescript
<BaseNode 
  selected={selected}
  nodeType={type}
  nodeDefinition={definition} // Automatically passed
  className={getNodeClassName()}
  style={getNodeStyle()}
>
```

## Automatic Color Generation

### Running the Generator

To automatically generate color mappings from node definitions:

```bash
npm run generate-colors
```

This script:
1. Reads node definitions from `mockNodeTypes.ts`
2. Extracts hex colors from each node
3. Converts them to the closest Tailwind colors
4. Updates the color mapping in `utils.ts`

### Adding New Node Types

1. **Define the color** in your node's JSON definition:
   ```typescript
   {
     id: 'my-custom-node',
     ui: {
       color: '#ff6b6b', // Your custom color
       // ... other UI properties
     }
   }
   ```

2. **Run the generator** to update color mappings:
   ```bash
   npm run generate-colors
   ```

3. **The system automatically** handles:
   - Default border color
   - Hover border color (lighter shade)
   - Hover shadow color (outward-growing effect)

## Fallback System

If a node definition doesn't have a color or the color mapping fails:

1. **Border Colors**: Falls back to hardcoded mappings for known node types
2. **Unknown Types**: Uses `border-gray-400` as default
3. **Hover Effects**: Uses `hover:border-gray-300` and a gray shadow

## Benefits

- **Scalable**: No need to manually add colors for each new node type
- **Consistent**: All colors are generated from the same source
- **Maintainable**: Single source of truth for node colors
- **Automatic**: Colors are generated from node definitions
- **Flexible**: Easy to change colors by updating the JSON definition

## Technical Details

### Color Matching Algorithm

The system uses Euclidean distance to find the closest Tailwind color:

```typescript
const distance = Math.sqrt(
  (r - colorRgb.r) ** 2 + 
  (g - colorRgb.g) ** 2 + 
  (b - colorRgb.b) ** 2
);
```

### Shadow Generation

Hover shadows are generated using the exact hex color with 50% opacity:

```css
hover:shadow-[0_0_0_2px_rgba(r,g,b,0.5)]
```

This creates an outward-growing effect that doesn't affect the node's internal layout.

## Migration Guide

### From Hardcoded Colors

If you have existing hardcoded color mappings:

1. **Add colors to node definitions**:
   ```typescript
   // Before
   'my-node': 'border-blue-500'
   
   // After
   {
     id: 'my-node',
     ui: { color: '#3b82f6' }
   }
   ```

2. **Run the generator**:
   ```bash
   npm run generate-colors
   ```

3. **Remove hardcoded mappings** from `utils.ts`

### Backward Compatibility

The system maintains backward compatibility with existing hardcoded mappings while prioritizing dynamic generation when node definitions are available. 