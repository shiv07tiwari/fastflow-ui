import React, {useCallback, useEffect, useState} from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  Edge,
  Node,
  OnConnect, OnNodesChange, applyNodeChanges, OnEdgesChange, applyEdgeChanges, useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import GeminiNode from '../components/gemini-node';
import axios from 'axios';
import TextNode from "../components/text-node";
import {applyLayout} from "../utils";

const nodeTypes = {
  gemini: GeminiNode,
  combine_text: TextNode,
};

interface FlowProps {
  workflowId: string;
}

const Workflow: React.FC<FlowProps> = ({ workflowId }) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const offset = 50;
  const { fitView } = useReactFlow();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const addNode = useCallback(() => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: 'customInput',
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      data: { label: `${nodes.length + 1}` },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/workflow/${workflowId}`);
      const data = response.data;
      const workflowNodes = data['nodes'];
      const workflowEdges = data['edges'] as Edge[];

      const workflowNodesArray = Object.keys(workflowNodes).map(key => workflowNodes[key]);

      for (let i = 0; i < workflowNodesArray.length; i++) {
        workflowNodesArray[i]["type"] = workflowNodesArray[i]["node"]["id"];
        workflowNodesArray[i]["data"] = { input: workflowNodesArray[i]["input"], output: workflowNodesArray[i]["output"] };
      }
      // @ts-ignore
      applyLayout(workflowNodesArray, workflowEdges).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        window.requestAnimationFrame(() => fitView());
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const executeWorkflow = useCallback(async () => {
    await axios.post(`http://localhost:8000/workflow/run`, {
        id: workflowId,
    });
  }, [workflowId]);

  useEffect(() => {
    fetchData();
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const onConnect = useCallback<OnConnect>(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button
        onClick={addNode}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 4, padding: '8px 12px' }}
      >
        Add Node
      </button>
      <button
        onClick={executeWorkflow}
        style={{ position: 'absolute', top: 10, left: 100, zIndex: 4, padding: '8px 12px' }}
      >
        Execute Workflow
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
        <Background variant={BackgroundVariant.Cross} gap={12} size={1} color={'red'} />
      </ReactFlow>
    </div>
  );
};

export default Workflow;