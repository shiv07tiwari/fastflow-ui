import React from 'react';
import { FaRobot } from "react-icons/fa";
import BaseNode from "./base-node";
import {NodeInput} from "../types";


const GeminiNode: React.FC<NodeInput> = ({ data }) => {
  return (
    <BaseNode
      data={data}
      title="Gemini AI"
      inputLabel="Prompt"
      inputIcon={<FaRobot />}
      inputType="text"
    />
  );
};

export default GeminiNode;