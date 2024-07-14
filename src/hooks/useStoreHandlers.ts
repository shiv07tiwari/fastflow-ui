import {useCallback} from "react";
import {useWorkflowStore} from "../store/workflow-store";
import {applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, Connection, Edge} from 'reactflow';
import {BaseNode} from "../types";
import {Node} from "../types";


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
            const innerInput = baseNode.inputs.filter((input) => !input.includes("input"));
            const inputDictionary = innerInput.reduce((acc, current) => {
                acc[current] = null;
                return acc;
            }, {} as { [key: string]: null });
            const handleInputs = baseNode.inputs.filter((input) => input.includes("input"));

            const node = {
                ...baseNode,
                id: nodeId,
                type: baseNode.id,
                position: {
                    x: width / 2 + Math.random() * 100,
                    y: height / 2 + Math.random() * 100
                },
                available_inputs: inputDictionary,
                required_inputs: innerInput,
                node: baseNode.id,
                data: {
                    id: nodeId,
                },
                input_handles: handleInputs,
                output_handles: baseNode.outputs,
                outputs: {}
            } as Node;
            // @ts-ignore
            delete node.inputs;

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
            // @ts-ignore
            updateNodeAvailableInputs(params.target, params.targetHandle || '');
            setEdges(addEdge(params, edges))
        },
        [edges, setEdges, updateNodeAvailableInputs]
    );

    return {onNodesChange, onEdgesChange, onConnect, onAddNode};
};