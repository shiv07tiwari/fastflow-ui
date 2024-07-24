import React from 'react';
import BaseNode from "./base-node";
import {NodeInput} from "../types";
import {useWorkflowStore} from "../store/workflow-store";


const RedditNode: React.FC<NodeInput> = ({data}) => {

    const {updateNodeAvailableInputs} = useWorkflowStore();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        updateNodeAvailableInputs(data.id, key, e.target.value);
    };

    return (
        <BaseNode
            data={data}
            title="Reddit AI"
            icon="reddit.png"
            inputs={[
                {
                    key: "query",
                    inputLabel: "Search Query",
                    inputType: "text"
                },
                {
                    key: "subreddit",
                    inputLabel: "Subreddit",
                    inputType: "text"
                },
                {
                    key: "post_limit",
                    inputLabel: "Number of posts [Default: 10]",
                    inputType: "number"
                }
            ]}
            handleInputChange={handleInputChange}
        />
    );
};

export default RedditNode;