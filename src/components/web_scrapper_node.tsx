import React from "react";
import {FaGlobe} from "react-icons/fa";
import BaseNode from "./base-node";
import {NodeInput} from "../types";
import {useWorkflowStore} from "../store/workflow-store";


const WebScrapperNode: React.FC<NodeInput> = ({data}) => {

    const {updateNodeAvailableInputs} = useWorkflowStore();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeAvailableInputs(data.id, "url", e.target.value);
    };

    return (
        <BaseNode
            data={data}
            title="Web Scraper"
            inputLabel={"URL to scrape"}
            inputIcon={<FaGlobe/>}
            inputType="url"
            handleInputChange={handleInputChange}
        />
    );
};

export default WebScrapperNode;