import React from 'react';
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import BaseNode from "./base-node";
import { Node } from "../types";
import { useWorkflowStore } from "../store/workflow-store";
import {useFileUpload} from "../hooks/useHandleFileUpload";

interface FileReaderNodeProps {
    data: Node;
}

const ZipReaderNode: React.FC<FileReaderNodeProps> = ({ data }) => {
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
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        console.log(file)
        if (file) {
            uploadFile(file);
        }
    };

    return (
        <BaseNode
            data={data}
            title="Zip Reader"
            handleInputChange={handleInputChange}
            status={status}
            icon="zip-folder.png"
        />
    );
};

export default ZipReaderNode;