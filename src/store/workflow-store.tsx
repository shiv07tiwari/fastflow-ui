import {create} from 'zustand'
import {Edge} from "reactflow";
import {BaseNode, Node} from "../types";

interface WorkflowState {
    nodes: Node[];
    edges: any[];
    baseNodes: BaseNode[];
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    setBaseNodes: (nodes: BaseNode[]) => void;
    updateNodeAvailableInputs: (nodeId: string, key: string, value: any) => void;
    deleteNodeAvailableInput: (nodeId: string, key: string) => void;
    getNode: (nodeId: string) => Node | undefined;  // New getter function=
    getEdge: (edgeId: string) => Edge;
    addNode: (node: Node) => void;
    deleteNode: (nodeId: string) => void;
}


export const useWorkflowStore = create<WorkflowState>((set, get) => ({
    nodes: [],
    baseNodes: [],
    edges: [],
    setNodes: (nodes: Node[]) => {
        set({nodes})
    },
    setEdges: (edges: Edge[]) => set({edges}),
    setBaseNodes: (baseNodes: BaseNode[]) => set({baseNodes}),
    updateNodeAvailableInputs: (nodeId: string, key: string, value: any) => {
        set((state) => {
            const updatedNodes = state.nodes.map((node) => {
                if (node.id === nodeId) {
                    // If not already present, add the key in required_inputs array
                    let newRequired = node.required_inputs;
                    if (node.required_inputs.indexOf(key) === -1)
                        newRequired = [...node.required_inputs, key];
                    return {
                        ...node,
                        available_inputs: {
                            ...node.available_inputs,
                            [key]: value,
                        },
                        required_inputs: newRequired
                    };
                }
                return node;
            });
            return {nodes: updatedNodes};
        });
    },
    deleteNodeAvailableInput: (nodeId: string, key: string) => {
        set((state) => {
            const updatedNodes = state.nodes.map((node) => {
                if (node.id === nodeId) {
                    const available_inputs = {...node.available_inputs};
                    delete available_inputs[key];

                    const newRequired = node.required_inputs.filter((inputKey: string) => inputKey !== key);
                    return {
                        ...node,
                        available_inputs,
                        required_inputs: newRequired
                    }
                }
                return node;
            });
            return {nodes: updatedNodes};
        });
    },
    getNode: (nodeId: string) => {
        const state = get();
        return state.nodes.find(node => node.id === nodeId);
    },
    getEdge: (edgeId: string) => {
        const state = get();
        return state.edges.find(edge => edge.id === edgeId);
    },
    addNode: (node: Node) => {
        set((state) => {
            return {nodes: [...state.nodes, node]};
        });
    },
    deleteNode: (nodeId: string) => {
        set((state) => {
            const updatedNodes = state.nodes.filter((node) => node.id !== nodeId);
            return {nodes: updatedNodes};
        });
    },
}));