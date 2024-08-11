import React from 'react';
import BaseNode from "../base-node";
import {NodeInput} from "../../types";
import {useWorkflowStore} from "../../store/workflow-store";


const DataAnalysisNode: React.FC<NodeInput> = ({data}) => {

    const {updateNodeAvailableInputs} = useWorkflowStore();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        updateNodeAvailableInputs(data.id, key, e.target.value);
    };

    return (
        <BaseNode
            data={data}
            title="Extractor"
            handleInputChange={handleInputChange}
        />
    );
};

export default DataAnalysisNode;