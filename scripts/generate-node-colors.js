#!/usr/bin/env node

/**
 * Script to automatically generate color mappings from node definitions
 * This script reads node definitions and generates the color mapping code
 */

const fs = require('node:fs');
const path = require('node:path');

// Function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16)
  } : null;
}

// Function to find closest Tailwind color
function findClosestTailwindColor(r, g, b) {
  // Tailwind color palette (simplified)
  const tailwindColors = {
    'slate': { r: 100, g: 116, b: 139 },
    'gray': { r: 156, g: 163, b: 175 },
    'zinc': { r: 161, g: 161, b: 170 },
    'neutral': { r: 163, g: 163, b: 163 },
    'stone': { r: 168, g: 162, b: 158 },
    'red': { r: 239, g: 68, b: 68 },
    'orange': { r: 249, g: 115, b: 22 },
    'amber': { r: 245, g: 158, b: 11 },
    'yellow': { r: 234, g: 179, b: 8 },
    'lime': { r: 132, g: 204, b: 22 },
    'green': { r: 34, g: 197, b: 94 },
    'emerald': { r: 16, g: 185, b: 129 },
    'teal': { r: 20, g: 184, b: 166 },
    'cyan': { r: 6, g: 182, b: 212 },
    'sky': { r: 14, g: 165, b: 233 },
    'blue': { r: 59, g: 130, b: 246 },
    'indigo': { r: 99, g: 102, b: 241 },
    'violet': { r: 139, g: 92, b: 246 },
    'purple': { r: 168, g: 85, b: 247 },
    'fuchsia': { r: 217, g: 70, b: 239 },
    'pink': { r: 236, g: 72, b: 153 },
    'rose': { r: 244, g: 63, b: 94 }
  };

  let closestColor = 'gray';
  let minDistance = Number.POSITIVE_INFINITY;

  for (const [colorName, colorRgb] of Object.entries(tailwindColors)) {
    const distance = Math.sqrt(
      (r - colorRgb.r) ** 2 + 
      (g - colorRgb.g) ** 2 + 
      (b - colorRgb.b) ** 2
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = colorName;
    }
  }

  return closestColor;
}

// Function to generate color mapping code
function generateColorMapping(nodeTypes) {
  let code = '// Auto-generated color mapping\n';
  code += 'const colorMap: Record<string, string> = {\n';
  
  for (const nodeType of nodeTypes) {
    if (nodeType.ui?.color) {
      const rgb = hexToRgb(nodeType.ui.color);
      if (rgb) {
        const tailwindColor = findClosestTailwindColor(rgb.r, rgb.g, rgb.b);
        code += `  '${nodeType.ui.color.toLowerCase()}': '${tailwindColor}', // ${nodeType.id}\n`;
      }
    }
  }
  
  code += '};\n';
  return code;
}

// Function to update the utils file
function updateUtilsFile(colorMappingCode) {
  const utilsPath = path.join(__dirname, '../src/shared/lib/utils.ts');
  let utilsContent = fs.readFileSync(utilsPath, 'utf8');
  
  // Find the colorMap section and replace it
  const colorMapRegex = /const colorMap: Record<string, string> = \{[\s\S]*?\};/;
  
  if (colorMapRegex.test(utilsContent)) {
    utilsContent = utilsContent.replace(colorMapRegex, colorMappingCode);
  } else {
    // If no colorMap found, insert it after the hexToTailwindColor function
    const insertPoint = utilsContent.indexOf('function hexToTailwindColor');
    if (insertPoint !== -1) {
      const functionEnd = utilsContent.indexOf('}', insertPoint);
      const beforeFunction = utilsContent.substring(0, functionEnd + 1);
      const afterFunction = utilsContent.substring(functionEnd + 1);
      utilsContent = `${beforeFunction}\n\n${colorMappingCode}${afterFunction}`;
    }
  }
  
  fs.writeFileSync(utilsPath, utilsContent);
  console.log('✅ Updated utils.ts with generated color mapping');
}

// Main execution
function main() {
  try {
    // Read node types from the mock data
    const mockNodeTypesPath = path.join(__dirname, '../src/widgets/flow-editor/data/mockNodeTypes.ts');
    const mockNodeTypesContent = fs.readFileSync(mockNodeTypesPath, 'utf8');
    
    // Extract the MOCK_NODE_TYPES array (simplified parsing)
    const nodeTypesMatch = mockNodeTypesContent.match(/export const MOCK_NODE_TYPES: NodeType\[\] = (\[[\s\S]*?\]);/);
    
    if (!nodeTypesMatch) {
      console.error('❌ Could not find MOCK_NODE_TYPES in mockNodeTypes.ts');
      return;
    }
    
    // For now, we'll manually extract the colors from the known node types
    // In a real implementation, you'd want to parse the TypeScript properly
    const knownNodeTypes = [
      { id: 'core/text-input', ui: { color: '#06b6d4' } },
      { id: 'core/visualize-text', ui: { color: '#8b5cf6' } },
      { id: 'core/generate-text', ui: { color: '#f97316' } },
      { id: 'core/prompt-crafter', ui: { color: '#6366f1' } },
      { id: 'core/json-node', ui: { color: '#3b82f6' } },
      { id: 'core/http-request', ui: { color: '#10b981' } },
      { id: 'core/if-condition', ui: { color: '#f59e0b' } }
    ];
    
    const colorMappingCode = generateColorMapping(knownNodeTypes);
    console.log('Generated color mapping:');
    console.log(colorMappingCode);
    
    updateUtilsFile(colorMappingCode);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateColorMapping, findClosestTailwindColor, hexToRgb }; 