import {useWorkflowStore} from "../store/workflow-store";
import {useCallback, useState} from "react";
import axios from "axios";

export const useUpdateWorkflow = (workflowId: string) => {
    const { nodes, edges, name } = useWorkflowStore();

    // States to track loading, data, and error
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [isError, setIsError] = useState(null);

    const updateWorkflow = useCallback(async () => {
        setIsLoading(true);
        setData(null);
        setIsError(null);
        await axios.post(`http://localhost:8000/workflow`, {
                id: workflowId,
                nodes,
                edges,
                name
            })
    }, [workflowId, nodes, edges, name]);

    return { updateWorkflow, isLoading, data, isError };
};