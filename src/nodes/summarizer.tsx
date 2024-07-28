import React from 'react';
import {FaRobot} from "react-icons/fa";
import BaseNode from "./base-node";
import {NodeInput} from "../types";
import {useWorkflowStore} from "../store/workflow-store";


const Summarizer: React.FC<NodeInput> = ({data}) => {

    const {updateNodeAvailableInputs} = useWorkflowStore();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        console.log(e.target.value)
        console.log(key)
        updateNodeAvailableInputs(data.id, key, e.target.value);
    };

    return (
        <BaseNode
            data={data}
            title="Summarizer"
            handleInputChange={handleInputChange}
        />
    );
};

export default Summarizer;