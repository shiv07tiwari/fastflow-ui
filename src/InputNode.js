import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const customNodeStyle = {
  padding: 10,
  border: '1px solid #ddd',
  borderRadius: 5,
  width: 200,
};

const InputNode = ({ data, isConnectable }) => {
  const [value, setValue] = useState(data.value || '');

  const handleChange = (event) => {
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
        style={{ width: '100%' }} // Added to improve input styling
      />
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
      <Handle type="target" position={Position.Top} id="b" isConnectable={isConnectable} />
    </div>
  );
};

export default InputNode;