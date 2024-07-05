import React, {useCallback, useEffect} from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    addEdge,
    Edge,
    Node,
    OnConnect, OnNodesChange, applyNodeChanges, OnEdgesChange, applyEdgeChanges, useReactFlow, EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import GeminiNode from '../components/gemini-node';
import axios from 'axios';
import TextNode from "../components/text-node";
import {applyLayout} from "../utils";
import {NodeData, useWorkflowStore} from "../store/workflow-store";
import WebScrapperNode from "../components/web_scrapper_node";

const nodeTypes = {
    gemini: GeminiNode,
    combine_text: TextNode,
    web_scraper: WebScrapperNode,
};

interface FlowProps {
    workflowId: string;
}

const Workflow: React.FC<FlowProps> = ({workflowId}) => {
    const {fitView} = useReactFlow();

    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        getEdge,
        updateNodeAvailableInputs,
        deleteNodeAvailableInput
    } = useWorkflowStore();


    const addNode = useCallback(() => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            type: 'customInput',
            position: {x: Math.random() * 200, y: Math.random() * 200},
            data: {label: `${nodes.length + 1}`},
        } as Node;
        // @ts-ignore
        setNodes([...nodes, newNode]);
    }, [nodes, setNodes]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/workflow/${workflowId}`);
            const data = response.data;
            const workflowNodes = data['nodes'];
            const workflowEdges = data['edges'] as Edge[];

            const workflowNodesArray = Object.keys(workflowNodes).map(key => workflowNodes[key]);

            for (let i = 0; i < workflowNodesArray.length; i++) {
                // Need type to render the correct component, need id to fetch the node data inside the component
                workflowNodesArray[i]["type"] = workflowNodesArray[i]["node"];
                workflowNodesArray[i]["data"] = {
                    id: workflowNodesArray[i]["id"],
                } as NodeData;
            }
            // @ts-ignore
            applyLayout(workflowNodesArray, workflowEdges).then(({nodes: layoutedNodes, edges: layoutedEdges}) => {
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
            nodes: nodes,
            edges: edges,
        });
    }, [workflowId, nodes, edges]);

    useEffect(() => {
        fetchData();
    }, [workflowId]);


    const onNodesChange = useCallback(
        // @ts-ignore
        (changes) => {
            // @ts-ignore
            setNodes(applyNodeChanges(changes, nodes))
        },
        [nodes, setNodes]
    );
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            // Loop over the changes and update the edges
            changes.forEach(change => {
                if (change['type'] === 'remove') {
                    const removedEdge = getEdge(change['id']);
                    deleteNodeAvailableInput(removedEdge.target, removedEdge.targetHandle || '');
                }
            });

            setEdges(applyEdgeChanges(changes, edges))
        },
        [deleteNodeAvailableInput, edges, getEdge, setEdges],
    );

    const onConnect = useCallback<OnConnect>(
        (params) => {
            console.log('onConnect', params);
            if (params.target)
              updateNodeAvailableInputs(params.target, params.targetHandle || '', '');
            setEdges(addEdge(params, edges))
        },
        [edges, setEdges]
    );

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <button
                onClick={addNode}
                style={{position: 'absolute', top: 10, left: 10, zIndex: 4, padding: '8px 12px'}}
            >
                Add Node
            </button>
            <button
                onClick={executeWorkflow}
                style={{position: 'absolute', top: 10, left: 100, zIndex: 4, padding: '8px 12px'}}
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
                <Controls/>
                <MiniMap/>
                <Background variant={BackgroundVariant.Cross} gap={12} size={1} color={'red'}/>
            </ReactFlow>
        </div>
    );
};

export default Workflow;