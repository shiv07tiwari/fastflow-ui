import React from 'react';
import {FaCodepen, FaRobot} from "react-icons/fa";
import BaseNode from "./base-node";
import {NodeInput} from "../types";


const TextNode: React.FC<NodeInput> = ({data}) => {
    return (
        <BaseNode
            data={data}
            title="Text Node"
            inputLabel=""
            inputIcon={<FaCodepen/>}
            inputType="text"
        />
    )
}

export default TextNode;