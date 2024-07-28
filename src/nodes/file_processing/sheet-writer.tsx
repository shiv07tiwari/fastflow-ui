import React from 'react';
import BaseNode from "../base-node";
import {useWorkflowStore} from "../../store/workflow-store";
import {NodeInput} from "../../types";


const SheetWriterNode: React.FC<NodeInput> = ({data}) => {

    const {updateNodeAvailableInputs} = useWorkflowStore();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        updateNodeAvailableInputs(data.id, key, e.target.value);
    };

    return (
        <BaseNode
            data={data}
            title="File Writer"
            handleInputChange={handleInputChange}
        />
    );
};

export default SheetWriterNode;