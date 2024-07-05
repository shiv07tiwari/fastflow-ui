import {create} from 'zustand'
import {Node as ReactNode, Edge} from "reactflow";

// Create an interface which extends the Node interface

interface Node extends ReactNode {
    available_inputs: any;
    required_inputs: any;
}

interface WorkflowState {
    nodes: Node[];
    edges: any[];
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    updateNodeAvailableInputs: (nodeId: string, key: string, value: any) => void;
    deleteNodeAvailableInput: (nodeId: string, key: string) => void;
    getNodeById: (nodeId: string) => Node | undefined;  // New getter function=
    getEdge: (edgeId: string) => Edge;
}

export interface NodeData {
    id: string;
    available_inputs: any;
    required_inputs: any;
    output: any;
    icon_url: string;
    name: string;
    description: string;
}

export interface NodeInput {
    data: NodeData;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
    nodes: [],
    edges: [],
    setNodes: (nodes: Node[]) => set({nodes}),
    setEdges: (edges: Edge[]) => set({edges}),
    updateNodeAvailableInputs: (nodeId: string, key: string, value: any) => {
        set((state) => {
            const updatedNodes = state.nodes.map((node) => {
                if (node.id === nodeId) {
                    // If not already present, add the key in required_inputs array
                    let newRequired = node.required_inputs;
                    if (node.required_inputs.indexOf(key) === -1)
                        newRequired = [...node.required_inputs, key];
                    console.log('newRequired', newRequired)
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
        console.log('deleteNodeAvailableInput', nodeId, key)
        set((state) => {
            const updatedNodes = state.nodes.map((node) => {
                if (node.id === nodeId) {
                    const available_inputs = {...node.available_inputs};
                    delete available_inputs[key];

                    const newRequired = node.required_inputs.filter((inputKey: string) => inputKey !== key);
                    console.log('newRequired', newRequired)
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
    getNodeById: (nodeId: string) => {
        const state = get();
        return state.nodes.find(node => node.id === nodeId);
    },
    getEdge: (edgeId: string) => {
        const state = get();
        console.log('getEdge', edgeId, state.edges)
        return state.edges.find(edge => edge.id === edgeId);
    },
}));