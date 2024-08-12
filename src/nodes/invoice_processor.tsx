import React from 'react';
import BaseNode from "./base-node";
import { Node } from "../types";
import { useWorkflowStore } from "../store/workflow-store";
import {useFileUpload} from "../hooks/useHandleFileUpload";

interface FileReaderNodeProps {
    data: Node;
}

const InvoiceProcessorNode: React.FC<FileReaderNodeProps> = ({ data }) => {
    const { updateNodeAvailableInputs } = useWorkflowStore();

    const onComplete = (downloadURL: string, status: string) => {
        if (status === 'successful' && downloadURL) {
            updateNodeAvailableInputs(data.id, "file_path", downloadURL);
        }
    };

    const { uploadFile, status } = useFileUpload(
        {onComplete}
    );

    // Handle the file directly in the input handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string, inputType?: string) => {
        if (inputType === "file") {
            const file = e.target.files?.[0];
            if (file) {
                uploadFile(file);
            }
        } else {
            updateNodeAvailableInputs(data.id, key, e.target.value);
        }

    };

    return (
        <BaseNode
            data={data}
            title="Invoice Processor"
            handleInputChange={handleInputChange}
            status={status}
        />
    );
};

export default InvoiceProcessorNode;