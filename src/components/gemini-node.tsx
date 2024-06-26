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
  value?: string;
  onChange?: (value: string) => void;
}

// Define the types for the props the component receives
interface InputNodeProps {
  data: NodeData;
  isConnectable: boolean;
}

const GeminiNode: React.FC<InputNodeProps> = ({ data, isConnectable }) => {
  const [value, setValue] = useState<string>(data.value || '');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
    if (data.onChange) {
      data.onChange(event.target.value);
    }
  };

  return (
    <div style={customNodeStyle}>
      <input
        id="input"
        type="text"
        value={value}
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