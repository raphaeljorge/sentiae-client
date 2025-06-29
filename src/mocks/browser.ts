import { setupWorker } from 'msw/browser';
import { workflowHandlers } from './handlers/workflow';

// Create worker with only our specific API handlers
export const worker = setupWorker(...workflowHandlers);

// Clean logging - only show successful mocks
worker.events.on('request:match', ({ request }) => {
  console.log(`✅ [MSW] ${request.method} ${request.url}`);
}); 