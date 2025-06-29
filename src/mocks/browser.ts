import { setupWorker } from 'msw/browser';
import { workflowHandlers } from './handlers/workflow';
import { nodeTypesHandlers } from './handlers/node-types';

// Create worker with all API handlers
export const worker = setupWorker(
  ...workflowHandlers,
  ...nodeTypesHandlers
);

// Clean logging - only show successful mocks
worker.events.on('request:match', ({ request }) => {
  console.log(`✅ [MSW] ${request.method} ${request.url}`);
});