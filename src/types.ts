import {Node as ReactNode} from "@reactflow/core/dist/esm/types/nodes";

export interface BaseNodeInput {
    key: string;
    handle_type: string;
    input_type: string;
    is_required?: boolean;
}

export interface BaseNode {
    id: string;
    name: string;
    icon_url: string;
    description: string;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
    node_type: string;
    inputs: BaseNodeInput[];
    outputs: string[];
    workflow_node_type: string;
}

export interface NodeInput {
    data: Node;
}

export interface Node extends ReactNode {
    id: string;
    available_inputs: any;
    icon_url: string;
    name: string;
    description: string;
    node: string;
    external_inputs: BaseNodeInput[];
    internal_inputs: BaseNodeInput[];
    common_inputs: BaseNodeInput[];
    output_handles: any;
    outputs: [];
}