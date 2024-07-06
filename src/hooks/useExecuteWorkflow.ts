// hooks/useExecuteWorkflow.js
import { useCallback } from "react";
import axios from "axios";
import { useWorkflowStore } from "../store/workflow-store";

export const useExecuteWorkflow = (workflowId: string) => {
    const { nodes, edges } = useWorkflowStore();

    const executeWorkflow = useCallback(async () => {
        await axios.post(`http://localhost:8000/workflow/run`, {
            id: workflowId,
            nodes,
            edges,
        });
    }, [workflowId, nodes, edges]);

    return executeWorkflow;
};