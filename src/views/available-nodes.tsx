import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";
import { BaseNode } from "../types";
import { MdSearch, MdClose } from "react-icons/md";

interface AvailableNodesProps {
  onClose: () => void;
  onSelectNode: (node: BaseNode) => void;
}

const AvailableNodes: React.FC<AvailableNodesProps> = ({ onClose, onSelectNode }) => {
  const [nodes, setNodes] = useState<BaseNode[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<BaseNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchNodes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8000/nodes');
      setNodes(response.data);
      setFilteredNodes(response.data);
    } catch (error) {
      console.error("Error fetching nodes:", error);
      setError("Failed to load nodes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  useEffect(() => {
    const filtered = nodes.filter(node =>
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNodes(filtered);
  }, [searchTerm, nodes]);

  const getBadgeColor = (nodeType: string): string => {
    switch (nodeType.toLowerCase()) {
      case 'input': return '#4A90E2';
      case 'ai': return '#50C878';
      case 'output': return '#5BC0DE';
      default: return '#A9A9A9';
    }
  };

  return (
    <div className="d-flex flex-column"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '320px',
        backgroundColor: '#F8F9FA',
        transition: 'right 0.3s ease',
        zIndex: 5,
        overflowY: 'auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '0 12px 12px 0',
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3"
        style={{ borderBottom: '1px solid #E0E0E0', backgroundColor: '#FFFFFF' }}
      >
        <h5 className="mb-0" style={{ color: '#333333', fontWeight: 600 }}>Available Nodes</h5>
        <button className="btn btn-link p-0" onClick={onClose} aria-label="Close">
          <MdClose size={24} color="#333333" />
        </button>
      </div>

      <div className="p-3" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="input-group">
          <span className="input-group-text" style={{ backgroundColor: '#F8F9FA' }}>
            <MdSearch size={20} color="#333333" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search nodes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ backgroundColor: '#F8F9FA', border: '1px solid #E0E0E0' }}
          />
        </div>
      </div>

      <div className="overflow-auto flex-grow-1 p-3">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" role="status" style={{ color: '#0E6DFC' }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          filteredNodes.map((node) => (
            <Card key={node.id} className="mb-3"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E0E0E0',
                opacity: node.is_active ? 1 : 0.5,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
              onClick={() => onSelectNode(node)}
            >
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <img src={node.icon_url} alt={node.name} className="me-3" style={{ width: '32px', height: '32px' }} />
                  <h6 className="mb-0" style={{ color: '#333333', fontWeight: 600 }}>{node.name}</h6>
                </div>
                <p className="mb-2 small" style={{ color: '#333333', opacity: 0.8 }}>{node.description}</p>
                <span className="badge"
                  style={{
                    backgroundColor: getBadgeColor(node.node_type),
                    color: '#FFFFFF',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  {node.node_type}
                </span>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableNodes;