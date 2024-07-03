import { create } from 'zustand'
import {Node, Edge} from "reactflow";

interface WorkflowState {
    nodes: Node[];
    edges: any[];
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    updateNodeAvailableInputs: (nodeId: string, key: string, value: any) => void;
    getNodeById: (nodeId: string) => Node | undefined;  // New getter function=
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
  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),
  updateNodeAvailableInputs: (nodeId: string, key: string, value: any) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            available_inputs: {
                ...node.data.available_inputs,
                [key]: value,
              },
          };
        }
        return node;
      });
      return { nodes: updatedNodes };
    });
  },
  getNodeById: (nodeId: string) => {
    const state = get();
    return state.nodes.find(node => node.id === nodeId);
  },
}));