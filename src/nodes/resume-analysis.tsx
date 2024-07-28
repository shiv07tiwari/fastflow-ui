import React from 'react';
import {BsFillFileEarmarkTextFill} from "react-icons/bs";
import BaseNode from "./base-node";
import {Node} from "../types";
import {useWorkflowStore} from "../store/workflow-store";
import {useFileUpload} from "../hooks/useHandleFileUpload";

interface FileReaderNodeProps {
    data: Node;
}

const ResumeAnalysisNode: React.FC<FileReaderNodeProps> = ({data}) => {
    const {updateNodeAvailableInputs} = useWorkflowStore();
    const onComplete = (downloadURL: string, status: string) => {
        console.log(downloadURL)
        console.log(status)
        if (status === 'successful' && downloadURL) {
            updateNodeAvailableInputs(data.id, "input_resume", downloadURL);
        }
    };

    const { uploadFile, status } = useFileUpload(
        {onComplete}
    );

    // Handle the file directly in the input handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        if (key === "input_resume") {
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
            title="Resume Analysis"
            handleInputChange={handleInputChange}
            status={status}
        />
    );
};

export default ResumeAnalysisNode;