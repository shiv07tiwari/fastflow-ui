import { create } from 'zustand'
import {Node, Edge} from "reactflow";

interface WorkflowState {
    nodes: Node[];
    edges: any[];
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    updateNodeInput: (nodeId: string, input: any) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: any[]) => set({ edges }),
  updateNodeInput: (nodeId: string, input: any) => set((state: any) => ({
    nodes: state.nodes.map((node: Node) => {
        if (node.id === nodeId) {
            return {
            ...node,
            data: {
                    ...node.data,
                    input,
                },
            };
        }
        return node;
    })
  })),
}))