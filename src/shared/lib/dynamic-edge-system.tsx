import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';
import type { EdgeTypeConfig } from '@/shared/types/node';
import { pluginSystem } from './plugin-system';

export interface DynamicEdgeProps extends EdgeProps {
  config?: EdgeTypeConfig;
}

export function createDynamicEdge(config: EdgeTypeConfig) {
  return function DynamicEdge(props: DynamicEdgeProps) {
    const {
      id,
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      style = {},
      markerEnd,
      data,
      selected,
    } = props;

    // Check if there's a custom plugin component
    if (config.component) {
      const PluginComponent = pluginSystem.getEdgeType(config.component);
      if (PluginComponent) {
        return React.createElement(PluginComponent, { ...props, config });
      }
    }

    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    // Build dynamic styles
    const edgeStyle = {
      ...style,
      stroke: config.style?.stroke || '#3b82f6',
      strokeWidth: config.style?.strokeWidth || 2,
      strokeDasharray: config.style?.strokeDasharray,
      ...(selected && { stroke: '#ff6b6b', strokeWidth: 3 }),
    };

    return (
      <>
        <BaseEdge
          path={edgePath}
          markerEnd={markerEnd}
          style={edgeStyle}
          className={config.style?.animated ? 'animate-pulse' : undefined}
        />

        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {data?.label && (
              <div className="bg-background border border-border rounded px-2 py-1 text-xs">
                {data.label}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      </>
    );
  };
}

// Edge type registry
const edgeTypeRegistry = new Map<string, React.ComponentType<any>>();

export function registerEdgeType(id: string, config: EdgeTypeConfig) {
  const EdgeComponent = createDynamicEdge(config);
  edgeTypeRegistry.set(id, EdgeComponent);
  return EdgeComponent;
}

export function getEdgeType(id: string): React.ComponentType<any> | undefined {
  return edgeTypeRegistry.get(id);
}

export function getAllEdgeTypes(): Record<string, React.ComponentType<any>> {
  return Object.fromEntries(edgeTypeRegistry);
}

// Built-in edge types
export const builtInEdgeTypes: EdgeTypeConfig[] = [
  {
    id: 'default',
    name: 'Default',
    style: {
      stroke: '#3b82f6',
      strokeWidth: 2,
    },
    behavior: {
      selectable: true,
      deletable: true,
      reconnectable: true,
    },
  },
  {
    id: 'success',
    name: 'Success',
    style: {
      stroke: '#10b981',
      strokeWidth: 2,
    },
    behavior: {
      selectable: true,
      deletable: true,
      reconnectable: true,
    },
  },
  {
    id: 'error',
    name: 'Error',
    style: {
      stroke: '#ef4444',
      strokeWidth: 2,
      strokeDasharray: '5,5',
    },
    behavior: {
      selectable: true,
      deletable: true,
      reconnectable: true,
    },
  },
  {
    id: 'data-flow',
    name: 'Data Flow',
    style: {
      stroke: '#8b5cf6',
      strokeWidth: 3,
      animated: true,
    },
    behavior: {
      selectable: true,
      deletable: true,
      reconnectable: true,
    },
  },
];

// Register built-in edge types
for (const config of builtInEdgeTypes) {
  registerEdgeType(config.id, config);
} 