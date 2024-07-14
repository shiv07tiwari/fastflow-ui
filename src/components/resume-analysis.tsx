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
            updateNodeAvailableInputs(data.id, "file_path", downloadURL);
        }
    };

    const { uploadFile, status } = useFileUpload(
        {onComplete}
    );

    // Handle the file directly in the input handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    return (
        <BaseNode
            data={data}
            title="File Reader"
            inputs={[
                {
                    key: "file_path",
                    inputLabel: "Upload File",
                    inputIcon: <BsFillFileEarmarkTextFill/>,
                    inputType: "file"
                }
            ]}
            handleInputChange={handleInputChange}
            status={status}
        />
    );
};

export default ResumeAnalysisNode;