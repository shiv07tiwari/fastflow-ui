import React, {useState} from 'react';
import {BsFillFileEarmarkTextFill} from "react-icons/bs";
import BaseNode from "./base-node";
import {Node} from "../types";
import {useWorkflowStore} from "../store/workflow-store";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

interface FileReaderNodeProps {
    data: Node;
}

const ResumeAnalysisNode: React.FC<FileReaderNodeProps> = ({data}) => {
    const {updateNodeAvailableInputs} = useWorkflowStore();
    const storage = getStorage();
    const [file, setFile] = useState(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            window.alert("Please select a file to upload");
            return;
        }
        // @ts-ignore
        const storageRef = ref(storage, `files/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = snapshot.ref.fullPath;
            updateNodeAvailableInputs(data.id, "file_path", downloadURL);
        } catch (error) {
            console.error('Upload failed', error);
        }
    };

    return (
        <BaseNode
            data={data}
            title="File Reader"
            inputLabel="Upload File"
            inputIcon={<BsFillFileEarmarkTextFill/>}
            inputType="file"
            handleInputChange={handleInputChange}
            handleFileUpload={handleFileUpload}
        />
    );
};

export default ResumeAnalysisNode;