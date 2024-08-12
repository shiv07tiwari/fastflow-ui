import {useCallback, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export const useCreateWorkflow = (userEmail: string) => {
    // States to track loading, data, and error
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [isError, setIsError] = useState(null);

    const updateWorkflow = useCallback(async () => {
        setIsLoading(true);
        setData(null);
        setIsError(null);
        await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/workflow`, {
                owner: userEmail
            }).then((response) => {
                const workflowId = response.data.workflow_id;
                navigate(`/workflow/${workflowId}`);
        })
    }, [navigate, userEmail]);

    return { updateWorkflow, isLoading, data, isError };
};