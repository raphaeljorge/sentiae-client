import express from 'express';
import cors from 'cors';

const app = express();
const port = 5174;

app.use(cors());
app.use(express.json());

// Mock AI text generation
async function generateAIText({ prompt, system, model, tools }) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // --- NEW LOGIC for tool usage ---
  // Check if any tools are provided and should be used
  if (tools?.length > 0) {
    console.log(`Simulating tool call for ${tools.length} tools.`);
    const parsedResult = {
      result: '', // When a tool is used, the main text is empty
    };

    // For each tool, simulate a result. The result is mapped to the tool's ID.
    for (const tool of tools) {
      // The key is the tool's ID, which matches the sourceHandle of the outgoing edge
      parsedResult[tool.id] = `Mock result for tool: ${tool.name}.`;
    }

    return {
      text: '', // Main text is empty
      parsedResult,
    };
  }

  // --- EXISTING LOGIC for simple text generation ---
  let response = "";
  
  if (system?.includes("summarize")) {
    response = "This is a mocked concise summary of the provided article, highlighting the key points about AI agents and digital identity verification.";
  } else if (system?.includes("Instagram")) {
    response = "Introducing a new era of AI interactions! Sam Altman's World is pioneering a groundbreaking initiative to link AI agents to digital identities. This 'proof of human' verification will ensure secure and personalized interactions between humans and AI. Imagine a future where AI understands your preferences and adapts to your needs. The possibilities are endless! #AI #DigitalIdentity #FutureOfTech";
  } else if (system?.includes("Twitter")) {
    response = "Breaking news! Sam Altman's World is launching a new initiative to link AI agents to digital identities, ensuring secure & personalized interactions. 'Proof of human' verification is the future of AI! #AI #DigitalIdentity #FutureOfTech";
  } else {
    response = `Generated content using ${model}: ${prompt.substring(0, 100)}...`;
  }
  
  return {
    text: response,
    parsedResult: { result: response }, // The key is 'result' for standard text outputs
  };
}

// Mock node processors
const serverNodeProcessors = {
  "text-input": async (node) => {
    return {
      result: node.data.config.value,
    };
  },

  "prompt-crafter": async (node, targetsData) => {
    if (!targetsData) {
      throw new Error("Targets data not found");
    }

    let parsedTemplate = node.data.config.template;
    const templateTags = node.data.dynamicHandles["template-tags"] || [];
    
    for (const [targetId, targetValue] of Object.entries(targetsData)) {
      const tag = templateTags.find(
        (handle) => handle.id === targetId,
      );
      if (!tag) {
        throw new Error(`Tag with id ${targetId} not found`);
      }
      parsedTemplate = parsedTemplate.replaceAll(
        `{{${tag.name}}}`,
        targetValue,
      );
    }
    
    // Clean up any remaining tags that weren't replaced.
    parsedTemplate = parsedTemplate.replace(/\{\{[^}]+\}\}/g, '');

    return {
      result: parsedTemplate,
    };
  },

  "generate-text": async (node, targetsData) => {
    const system = targetsData?.system;
    const prompt = targetsData?.prompt;
    
    if (!prompt) {
      throw new Error("Prompt not found");
    }

    const result = await generateAIText({
      prompt,
      system,
      model: node.data.config.model,
      tools: node.data.dynamicHandles.tools,
    });

    return result.parsedResult;
  },

  "visualize-text": async () => {
    return undefined;
  },
};

// Mock workflow execution engine
function createEvent(type, data) {
  return `data: ${JSON.stringify({ type, ...data })}\n\n`;
}

async function executeWorkflow(workflow, send) {
  console.log('Starting workflow execution with:', {
    nodes: workflow.nodes.map(n => ({ id: n.id, type: n.type })),
    edges: workflow.edges.map(e => ({ source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle })),
  });
  
  const executionOrder = workflow.executionOrder || resolveExecutionOrder(workflow);
  console.log('Execution order:', executionOrder);

  for (const nodeId of executionOrder) {
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (!node) {
      console.warn(`Node with id ${nodeId} not found in workflow.`);
      continue;
    }

    // A node can only run if all its inputs are satisfied.
    const incomingEdges = workflow.edges.filter((edge) => edge.target === nodeId);
    if (incomingEdges.length > 0) {
      const isRunnable = incomingEdges.every((edge) => {
        const sourceNode = workflow.nodes.find((n) => n.id === edge.source);
        // An input is satisfied if the source node has an execution state and its `sources` object has the required handle.
        return sourceNode?.data?.executionState?.sources ? Object.prototype.hasOwnProperty.call(sourceNode.data.executionState.sources, edge.sourceHandle) : false;
      });

      if (!isRunnable) {
        console.log(`Skipping node ${nodeId} because its input dependencies are not met.`);
        send({
          type: 'nodeUpdate',
          nodeId: nodeId,
          executionState: {
            status: 'skipped',
            timestamp: new Date().toISOString(),
          },
        });
        // This node is on a dead branch, so we skip it.
        continue;
      }
    }

    await processNode(node, workflow, send);
  }

  console.log('Workflow execution completed');
  send({ type: 'complete', timestamp: new Date().toISOString() });
}

function resolveExecutionOrder(workflow) {
  const { nodes, edges } = workflow;
  const inDegree = new Map();
  const adjList = new Map();
  const queue = [];
  const executionOrder = [];

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjList.set(node.id, []);
  }

  for (const edge of edges) {
    const { source, target } = edge;
    // Check if nodes exist before creating edge
    if (adjList.has(source) && adjList.has(target)) {
      adjList.get(source).push(target);
      inDegree.set(target, (inDegree.get(target) || 0) + 1);
    } else {
      console.warn(`Edge references non-existent node. Source: ${source}, Target: ${target}`);
    }
  }

  for (const [nodeId, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  while (queue.length > 0) {
    const u = queue.shift();
    executionOrder.push(u);

    if (adjList.has(u)) {
      for (const v of adjList.get(u)) {
        inDegree.set(v, inDegree.get(v) - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }
  }

  if (executionOrder.length !== nodes.length) {
    console.warn("Cycle detected in workflow graph or disconnected nodes. Execution might be incomplete.");
    // Even with a cycle, we can still try to execute the parts that are valid.
    // Add nodes that were not part of the initial queue and have no executed predecessors
    for (const node of nodes) {
      if (!executionOrder.includes(node.id)) {
        executionOrder.push(node.id);
      }
    }
  }

  return executionOrder;
}

async function processNode(node, workflow, send) {
  const nodeId = node.id;
  
  console.log(`Processing node: ${nodeId} (${node.type})`);
  
  const targetsData = getNodeTargetsData(workflow, nodeId);

  const processingState = {
    status: 'processing',
    timestamp: new Date().toISOString(),
    targets: targetsData,
  };
  if (!node.data) node.data = {};
  node.data.executionState = { ...node.data.executionState, ...processingState };
  send({
    type: 'nodeUpdate',
    nodeId: nodeId,
    executionState: processingState,
  });

  try {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    const processor = serverNodeProcessors[node.type];
    if (!processor) {
      throw new Error(`No processor found for node type ${node.type}`);
    }
    const result = await processor(node, targetsData);

    const successState = {
      status: 'success',
      timestamp: new Date().toISOString(),
      sources: result,
    };
    node.data.executionState = { ...node.data.executionState, ...successState };
    send({
      type: 'nodeUpdate',
      nodeId: nodeId,
      executionState: successState,
    });
    return result; // Return the result on success
  } catch (error) {
    console.error(`Error processing node ${nodeId}:`, error);
    const errorState = {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
      }
    };
    node.data.executionState = { ...node.data.executionState, ...errorState };
    send({
      type: 'nodeUpdate',
      nodeId: nodeId,
      executionState: errorState,
    });
  }
}

function getNodeTargetsData(workflow, nodeId) {
  const edgesConnectedToNode = workflow.edges.filter(
    (edge) => edge.target === nodeId,
  );

  console.log(`\n[getNodeTargetsData for ${nodeId}]`);
  const targetsData = {};
  for (const edge of edgesConnectedToNode) {
    const sourceNode = workflow.nodes.find((n) => n.id === edge.source);
    
    if (!sourceNode) {
      console.log(`  - Source node ${edge.source} not found for edge ${edge.id}`);
      continue;
    }

    console.log(`  - Checking source: ${sourceNode.id} (type: ${sourceNode.type}) for target handle: ${edge.targetHandle}`);
    console.log(`    Source node execution state:`, sourceNode.data.executionState);

    // For text-input nodes, get the value directly from config
    if (sourceNode.type === 'text-input') {
      targetsData[edge.targetHandle] = sourceNode.data.config.value;
      console.log(`    -> Found value in text-input config.`);
    }
    // For other nodes, check if they have execution state with sources
    else if (sourceNode.data.executionState?.sources) {
      const sourceNodeResult =
        sourceNode.data.executionState.sources[edge.sourceHandle];
      if (sourceNodeResult) {
        targetsData[edge.targetHandle] = sourceNodeResult;
        console.log(`    -> Found value in sources for handle: ${edge.sourceHandle}.`);
      } else {
        console.log(`    -> No value found in sources for handle: ${edge.sourceHandle}.`);
      }
    } else {
        console.log(`    -> Source node ${sourceNode.id} has no executionState.sources.`);
    }
  }

  console.log(`  => Final targets data for node ${nodeId}:`, targetsData);
  return targetsData;
}

// API endpoint for workflow execution
app.post('/api/workflow/execute', async (req, res) => {
  const { workflow } = req.body;

  console.log('Received workflow execution request:', {
    nodesCount: workflow?.nodes?.length || 0,
    edgesCount: workflow?.edges?.length || 0,
    workflowId: workflow?.id
  });

  if (!workflow) {
    return res.status(400).json({ error: "No workflow data provided" });
  }

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  const send = (data) => {
    res.write(createEvent(data.type, data));
  }

  try {
    // Execute workflow
    await executeWorkflow(workflow, send);
    console.log('Workflow execution completed successfully');
  } catch (error) {
    console.error('Workflow execution error:', error);
    send({ type: 'error', error: error.message || 'Unknown error' });
  } finally {
    res.end();
  }
});

app.listen(port, () => {
  console.log(`Workflow execution server running at http://localhost:${port}`);
}); 