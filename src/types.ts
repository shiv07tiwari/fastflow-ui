import {Node as ReactNode} from "@reactflow/core/dist/esm/types/nodes";

export interface BaseNode {
    id: string;
    name: string;
    icon_url: string;
    description: string;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
    node_type: string;
    inputs: string[];
    outputs: string[];
    workflow_node_type: string;
}

export interface NodeInput {
    data: Node;
}


export interface Node extends ReactNode {
    id: string;
    available_inputs: any;
    required_inputs: any;
    output: any;
    icon_url: string;
    name: string;
    description: string;
    node: string;
    input_handles: number;
}