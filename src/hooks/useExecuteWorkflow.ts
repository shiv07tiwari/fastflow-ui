import { useCallback, useState } from "react";
import axios from "axios";
import { useWorkflowStore } from "../store/workflow-store";

export const useExecuteWorkflow = (workflowId: string) => {
    const { nodes, edges } = useWorkflowStore();

    // States to track loading, data, and error
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [isError, setIsError] = useState(null);

    const executeWorkflow = useCallback(async (runId: string, node_id?: string) => {
        setIsLoading(true);
        setData(null);
        setIsError(null);

        await axios.post(`http://localhost:8000/workflow/run`, {
                id: workflowId,
                nodes,
                edges,
                run_id: runId,
                node_id: node_id,
            }).then((res) => {
                setData(res.data);
                setIsLoading(false);
            }).catch((error) => {
                console.error("Failed to execute workflow:", error);
                setIsError(error);
                setIsLoading(false);
        });
    }, [workflowId, nodes, edges]);

    return { executeWorkflow, isLoading, data, isError };
};