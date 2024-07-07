import {useCallback} from "react";
import {useWorkflowStore} from "../store/workflow-store";
import {applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, Connection, Edge} from 'reactflow';
import {BaseNode} from "../types";

export const useReactFlowHandlers = () => {
    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        getEdge,
        deleteNode,
        addNode,
        updateNodeAvailableInputs,
        deleteNodeAvailableInput
    } = useWorkflowStore();


    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            changes.forEach(change => {
                if (change.type === 'remove') {
                    deleteNode(change.id);
                }
            });
            // @ts-ignore
            setNodes(applyNodeChanges(changes, nodes))
        },
        [deleteNode, nodes, setNodes]
    );

    const onAddNode = useCallback(
        (baseNode: BaseNode) => {
            const container = document.querySelector(".react-flow__renderer");
            const width = container ? container.clientWidth : window.innerWidth;
            const height = container ? container.clientHeight : window.innerHeight;

            const nodeId = `node_${Math.random().toString(36).substr(2, 9)}`;
            const node = {
                ...baseNode,
                id: nodeId,
                type: baseNode.id,
                position: {
                    // Specify position - here placing randomly or could place based on some logic
                    x: width / 2 + Math.random() * 100,
                    y: height / 2 + Math.random() * 100
                },
                available_inputs: {},
                required_inputs: [],
                output: {},
                node: baseNode.id,
                data: {
                    id: nodeId,
                }
            };

            addNode(node);
        }, [addNode]
    );

    const onEdgesChange = useCallback(
        (changes: any[]) => {
            changes.forEach(change => {
                if (change.type === 'remove') {
                    const removedEdge = getEdge(change.id);
                    deleteNodeAvailableInput(removedEdge.target, removedEdge.targetHandle || '');
                }
            });
            setEdges(applyEdgeChanges(changes, edges));
        },
        [edges, setEdges, getEdge, deleteNodeAvailableInput]
    );

    const onConnect = useCallback(
        (params: Edge<any> | Connection) => {
            console.log("Connection Params: ", params)
            // @ts-ignore
            updateNodeAvailableInputs(params.target, params.targetHandle || '');
            setEdges(addEdge(params, edges))
        },
        [edges, setEdges, updateNodeAvailableInputs]
    );

    return {onNodesChange, onEdgesChange, onConnect, onAddNode};
};