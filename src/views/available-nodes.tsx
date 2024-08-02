import React, {useEffect, useState, useCallback} from "react";
import axios from "axios";
import {Spinner, Card, Button, Dropdown} from "react-bootstrap";
import {BaseNode} from "../types";
import {MdSearch, MdClose, MdMoreVert} from "react-icons/md";
import NodeCard from "../common/node-card";

interface AvailableNodesProps {
    onSelectNode: (node: BaseNode) => void;
    onClose: () => void;
}

const AvailableNodes: React.FC<AvailableNodesProps> = ({onSelectNode, onClose}) => {
    const [nodes, setNodes] = useState<BaseNode[]>([]);
    const [filteredNodes, setFilteredNodes] = useState<BaseNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);

    const fetchNodes = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:8000/base-nodes');
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

    return (
        <div className="available-nodes-container">
            <div className="search-container">
                <div className="search-input-wrapper">
                    <MdSearch size={24} className="search-icon me-5" color="black"/>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search nodes"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="close-button ms-2 me-1" onClick={onClose} aria-label="Close">
                        <MdClose size={24}/>
                    </button>
                </div>
            </div>

            <div className="nodes-grid-container">
                {isLoading ? (
                    <div className="loading-spinner">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                    </div>
                ) : (
                    <div className="nodes-flex-container">
                        {filteredNodes.map((node) => (
                            <NodeCard
                                node={node}
                                key={node.id}
                                size='large'
                                onSelect={onSelectNode}
                            />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        .available-nodes-container {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          max-width: 529px;
          transition: right 0.3s ease;
          z-index: 5;
          display: flex;
          background-color: #FFFFFF;
          flex-direction: column;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-radius: 0 12px 12px 0;
        }

        .available-nodes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #E0E0E0;
          background-color: #FFFFFF;
        }

        .available-nodes-header h5 {
          margin: 0;
          color: #333333;
          font-weight: 600;
          font-size: 18px;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #333333;
          padding: 4px;
        }

        .search-container {
          padding: 16px 20px;
          background-color: #FFFFFF;
          border-bottom: 1px solid #E0E0E0;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #757575;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #E0E0E0;
          border-radius: 24px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #4A90E2;
        }

        .nodes-grid-container {
          flex-grow: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .nodes-flex-container {
          display: flex;
          flex-wrap: wrap;
        }

        .node-card {
          flex-basis: calc(50% - 8px);
          max-width: calc(50% - 8px);
          border: none;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .node-image {
          height: 120px;
          background-size: cover;
          background-position: center;
          background-color: #E0E0E0;
        }

        .node-content {
          padding: 16px;
        }

        .node-title {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
        }

        .node-description {
          font-size: 14px;
          color: #666666;
          margin-bottom: 16px;
        }

        .select-button {
          width: 100%;
          background-color: #4A90E2;
          border: none;
          color: white;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .select-button:hover {
          background-color: #3A80D2;
        }

        .loading-spinner, .error-message {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        .error-message {
          color: #dc3545;
          text-align: center;
        }

        @media (max-width: 600px) {
          .node-card {
            flex-basis: 100%;
            max-width: 100%;
          }
        }
      `}</style>
        </div>
    );
};

export default AvailableNodes;