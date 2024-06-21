import React, {useCallback, useEffect, useMemo} from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow, ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import InputNode from "./InputNode";


const nodeTypes = {
  customInput: InputNode,
};

const Flow = () => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'smoothstep' }];

    // Offset the nodes to be around the center
  const offset = 50;
  const initialNodes = useMemo(() => ([
      { id: '1', position: { x: centerX - offset, y: centerY - offset }, data: { label: '1' }, type: 'customInput' },
      { id: '2', position: { x: centerX + offset, y: centerY + offset }, data: { label: '2' }, type: 'customInput' },
    ]), [centerX, centerY, offset]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: 'customInput',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `${nodes.length + 1}` },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button
        onClick={addNode}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 4, padding: '8px 12px' }}
      >
        Add Node
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="cross" gap={12} size={1} color={'red'} />
      </ReactFlow>
    </div>
  );
};


export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}