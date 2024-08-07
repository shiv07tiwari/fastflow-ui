import {create} from 'zustand'
import {Edge} from "reactflow";
import {BaseNode, Node} from "../types";
import { devtools } from 'zustand/middleware'


interface WorkflowState {
    nodes: Node[];
    edges: any[];
    name?: string;
    baseNodes: BaseNode[];
    setName: (name: string) => void;
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


export const useWorkflowStore = create(devtools<WorkflowState>((set, get) => ({    nodes: [],
    baseNodes: [],
    edges: [],
    name: '',
    setNodes: (nodes: Node[]) => {
        set({nodes})
    },
    setName: (name: string) => {
        set({name})
    },
    setEdges: (edges: Edge[]) => set({edges}),
    setBaseNodes: (baseNodes: BaseNode[]) => set({baseNodes}),
    updateNodeAvailableInputs: (nodeId: string, key: string, value: any) => {
        set((state) => {
            const updatedNodes = state.nodes.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        available_inputs: {
                            ...node.available_inputs,
                            [key]: value,
                        },
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
                    return {
                        ...node,
                        available_inputs,
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
}) , {
    name: 'workflow-store'
}));