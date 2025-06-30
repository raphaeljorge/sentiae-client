import { http, HttpResponse } from 'msw';
import { MOCK_NODE_TYPES } from '@/widgets/flow-editor/data/mockNodeTypes';
import { NODE_SCHEMA_EXAMPLES } from '@/shared/types/node-schema';

// Handler for node types API
export const nodeTypesHandlers = [
  // Get all node types
  http.get('/api/node-types', () => {
    return HttpResponse.json(MOCK_NODE_TYPES);
  }),

  // Get node schemas
  http.get('/api/node-schemas', _ => {
    return HttpResponse.json(NODE_SCHEMA_EXAMPLES);
  }),

  // Get a specific node type by ID
  http.get('/api/node-types/:id', ({ params }) => {
    const { id } = params;
    const nodeType = MOCK_NODE_TYPES.find(node => node.id === id);
    
    if (!nodeType) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(nodeType);
  }),

  // Get node schema by type
  http.get('/api/node-schemas/:type', ({ params }) => {
    const { type } = params;
    const schema = NODE_SCHEMA_EXAMPLES[type as keyof typeof NODE_SCHEMA_EXAMPLES];
    
    if (!schema) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(schema);
  }),
];