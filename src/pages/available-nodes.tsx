import React, { useEffect, useState } from "react";
import axios from "axios";

interface Node {
  id: string;
  name: string;
  icon_url: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
  node_type: string;
  inputs: string[];
  outputs: string[];
  workflow_node_type: string;
}

interface AvailableNodesProps {
  onClose: () => void;
}

const AvailableNodes: React.FC<AvailableNodesProps> = ({ onClose }) => {
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/nodes')
      .then((response) => {
        setNodes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching nodes:", error);
      });
  }, []);

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0">Available Nodes</h5>
        <button className="btn-close" onClick={onClose} aria-label="Close"></button>
      </div>
      <div className="overflow-auto flex-grow-1">
        <ul className="list-group list-group-flush">
          {nodes.map((node) => (
            <li key={node.id} className={`list-group-item ${node.is_active ? '' : 'opacity-50'}`}>
              <div className="d-flex align-items-center mb-2">
                <img src={node.icon_url} alt={node.name} className="me-2" style={{width: '24px', height: '24px'}} />
                <h6 className="mb-0">{node.name}</h6>
              </div>
              <p className="mb-1 small text-muted">{node.description}</p>
              <span className={`badge bg-${getBadgeColor(node.node_type)}`}>
                {node.node_type}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function getBadgeColor(nodeType: string): string {
  switch (nodeType.toLowerCase()) {
    case 'input':
      return 'primary';
    case 'process':
      return 'success';
    case 'output':
      return 'info';
    default:
      return 'secondary';
  }
}

export default AvailableNodes;