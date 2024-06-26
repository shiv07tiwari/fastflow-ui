import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';

type NodeData = {
  input: any;
  output: any;
};


function TextNode({ data }: NodeProps<NodeData>) {
  return (
      <div>
        <div>Combined Output : {data.output["combined_text"]}</div>
        <Handle type="source" position={Position.Bottom} />
        <Handle type="target" position={Position.Top} />
      </div>
  )
}

export default TextNode;