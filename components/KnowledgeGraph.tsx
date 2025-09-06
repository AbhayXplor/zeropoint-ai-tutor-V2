import React, { useState, useMemo } from 'react';
import { KnowledgeMap, Assumption } from '../types';

interface KnowledgeGraphProps {
  knowledge_map: KnowledgeMap;
  assumptions: Assumption[];
}

interface Node {
  name: string;
  x: number;
  y: number;
  level: number;
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  from: string;
  to: string;
}

const levelColors = {
  0: '#3b82f6', // brand-secondary (target concept)
  1: '#1e3a8a', // brand-primary (direct prerequisites)
  2: '#1e293b', // brand-dark (indirect prerequisites)
};

const severityColors = {
  Critical: '#ef4444', // accent-red
  Helpful: '#f59e0b',  // accent-yellow
  Advanced: '#10b981', // accent-green
};


const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ knowledge_map, assumptions }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [connectedNodes, setConnectedNodes] = useState<Set<string>>(new Set());

  const conceptSeverityMap = useMemo(() => {
    const map = new Map<string, 'Critical' | 'Helpful' | 'Advanced'>();
    assumptions.forEach(a => {
        map.set(a.prerequisite_concept, a.severity);
    });
    return map;
  }, [assumptions]);


  const { nodes, edges } = useMemo(() => {
    const allNodeNames = new Set<string>([
      knowledge_map.target_concept,
      ...knowledge_map.direct_prerequisites,
      ...knowledge_map.indirect_prerequisites,
    ]);

    const nodeLevels: Record<string, number> = {};
    nodeLevels[knowledge_map.target_concept] = 0;
    knowledge_map.direct_prerequisites.forEach(p => (nodeLevels[p] = 1));
    knowledge_map.indirect_prerequisites.forEach(p => (nodeLevels[p] = 2));
    
    // Fallback for any nodes in dependency chain not in other lists
    knowledge_map.dependency_chain.forEach(dep => {
        if (nodeLevels[dep.from] === undefined) nodeLevels[dep.from] = 2;
        if (nodeLevels[dep.to] === undefined) nodeLevels[dep.to] = 1;
    });


    const levelCounts: Record<number, number> = {};
    Array.from(allNodeNames).forEach(name => {
      const level = nodeLevels[name] ?? 2;
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });

    const nodePositions: { [key: string]: { x: number; y: number; level: number } } = {};
    const levelIndices: Record<number, number> = { 0: 0, 1: 0, 2: 0 };
    const width = 800;
    const height = 400;

    const sortedNodeNames = Array.from(allNodeNames).sort((a, b) => (nodeLevels[a] ?? 2) - (nodeLevels[b] ?? 2));

    sortedNodeNames.forEach(name => {
      const level = nodeLevels[name] ?? 2;
      const countOnLevel = levelCounts[level] || 1;
      const indexOnLevel = levelIndices[level];

      const x = (width / (countOnLevel + 1)) * (indexOnLevel + 1);
      const y = level * 125 + 60; // Spacing between levels

      nodePositions[name] = { x, y, level };
      levelIndices[level]++;
    });

    const calculatedEdges: Edge[] = knowledge_map.dependency_chain
      .map(dep => {
        const fromNode = nodePositions[dep.from];
        const toNode = nodePositions[dep.to];
        if (!fromNode || !toNode) return null;
        return {
          x1: fromNode.x,
          y1: fromNode.y,
          x2: toNode.x,
          y2: toNode.y,
          from: dep.from,
          to: dep.to,
        };
      })
      .filter((e): e is Edge => e !== null);

    const calculatedNodes: Node[] = Object.entries(nodePositions).map(([name, pos]) => ({
      name,
      ...pos,
    }));

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [knowledge_map]);

  const handleMouseEnter = (nodeName: string) => {
    setHoveredNode(nodeName);
    const connections = new Set([nodeName]);
    knowledge_map.dependency_chain.forEach(dep => {
      if (dep.from === nodeName) connections.add(dep.to);
      if (dep.to === nodeName) connections.add(dep.from);
    });
    setConnectedNodes(connections);
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
    setConnectedNodes(new Set());
  };

  return (
    <div className="w-full min-h-[450px] bg-gray-50 rounded-lg p-2 sm:p-4 border border-gray-200 overflow-x-auto">
      <svg width="100%" height="420" viewBox="0 0 800 420" aria-labelledby="graph-title" role="img">
        <title id="graph-title">A graph showing the dependency chain of mathematical concepts.</title>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
          </marker>
        </defs>
        <g className="edges">
          {edges.map((edge, i) => (
            <line
              key={i}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="#9ca3af"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              style={{
                transition: 'opacity 0.2s ease-in-out',
                opacity: !hoveredNode || (connectedNodes.has(edge.from) && connectedNodes.has(edge.to)) ? 0.6 : 0.1,
              }}
            />
          ))}
        </g>
        <g className="nodes">
          {nodes.map(node => {
            const severity = conceptSeverityMap.get(node.name);
            const nodeColor = severity ? severityColors[severity] : (levelColors[node.level] || '#1e293b');

            return(
            <g
              key={node.name}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => handleMouseEnter(node.name)}
              onMouseLeave={handleMouseLeave}
              style={{
                transition: 'opacity 0.2s ease-in-out',
                opacity: !hoveredNode || connectedNodes.has(node.name) ? 1 : 0.3,
                cursor: 'pointer',
              }}
              aria-label={`Concept: ${node.name}`}
            >
              <circle r="10" fill={nodeColor} stroke="#fff" strokeWidth="2" />
              <text
                textAnchor="middle"
                y="-18"
                fontSize="14px"
                fill="#1e293b"
                fontWeight="600"
                className="select-none"
              >
                {node.name.length > 25 ? node.name.substring(0, 22) + '...' : node.name}
              </text>
              <title>{node.name}</title>
            </g>
            )
          })}
        </g>
      </svg>
    </div>
  );
};

export default KnowledgeGraph;