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

            const nodeId = `${baseNode.name}-node_${Math.random().toString(36).substr(2, 9)}`;

            // Pre set all the internal inputs in required and available inputs
            const internalInputs = baseNode.inputs.filter((input) => input.handle_type === "internal");
            const externalInputs = baseNode.inputs.filter((input) => input.handle_type === "external");
            const commonInputs = baseNode.inputs.filter((input) => input.handle_type === "common");

            const initAvailableInputs = [...internalInputs, ...commonInputs].reduce((acc, current) => {
                acc[current.key] = null;
                return acc;
            }, {} as { [key: string]: null });

            const node = {
                ...baseNode,
                id: nodeId,
                type: baseNode.id,
                position: {
                    x: width / 2 + Math.random() * 100,
                    y: height / 2 + Math.random() * 100
                },
                available_inputs: initAvailableInputs,
                node: baseNode.id,
                data: {
                    id: nodeId,
                },
                external_inputs: externalInputs,
                internal_inputs: internalInputs,
                common_inputs: commonInputs,
                output_handles: baseNode.outputs,
                outputs: []
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