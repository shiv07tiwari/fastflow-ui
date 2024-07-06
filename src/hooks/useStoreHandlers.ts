// hooks/useStoreHandlers.js
import { useCallback } from "react";
import { useWorkflowStore } from "../store/workflow-store";
import { applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, Connection, Edge} from 'reactflow';

export const useStoreHandlers = () => {
    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        getEdge,
        updateNodeAvailableInputs,
        deleteNodeAvailableInput
    } = useWorkflowStore();


    const onNodesChange = useCallback(
        // @ts-ignore
        (changes: NodeChange[]) => setNodes(applyNodeChanges(changes, nodes)),
        [nodes, setNodes]
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

    return { onNodesChange, onEdgesChange, onConnect };
};