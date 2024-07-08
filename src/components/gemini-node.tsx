import React from 'react';
import {FaRobot} from "react-icons/fa";
import BaseNode from "./base-node";
import {NodeInput} from "../types";
import {useWorkflowStore} from "../store/workflow-store";


const GeminiNode: React.FC<NodeInput> = ({data}) => {

    const {updateNodeAvailableInputs} = useWorkflowStore();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeAvailableInputs(data.id, "prompt", e.target.value);
    };

    return (
        <BaseNode
            data={data}
            title="Gemini AI"
            inputLabel="Prompt"
            inputIcon={<FaRobot/>}
            inputType="text"
            handleInputChange={handleInputChange}
        />
    );
};

export default GeminiNode;