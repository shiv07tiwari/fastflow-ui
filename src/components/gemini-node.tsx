import React, { useState, ChangeEvent } from 'react';
import { Handle, Position } from 'reactflow';

const customNodeStyle: React.CSSProperties = {
  padding: 10,
  border: '1px solid #ddd',
  borderRadius: 5,
  width: 200,
};

// Define the types for your node data
interface NodeData {
    input: any;
    output: any;
}

// Define the types for the props the component receives
interface InputNodeProps {
  data: NodeData;
  isConnectable: boolean;
}

const GeminiNode: React.FC<InputNodeProps> = ({ data, isConnectable }) => {
  const [prompt, setPrompt] = useState<string>(data.input["prompt"]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPrompt(event.target.value);
  };

  return (
    <div style={customNodeStyle}>
      <input
        id="input"
        type="text"
        value={prompt}
        onChange={handleChange}
        style={{ width: '100%' }}
        // Optional: Adding 'isConnectable' as a prop to input for potential custom logic
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default GeminiNode;