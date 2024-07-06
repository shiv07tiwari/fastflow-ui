// GeminiNode.tsx
import React from 'react';
import { FaRobot, FaKeyboard } from "react-icons/fa";
import { NodeInput } from "../store/workflow-store";
import BaseNode from "./base-node";

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