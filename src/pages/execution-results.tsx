import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Accordion, Spinner } from 'react-bootstrap';
import { underscoreToReadable } from "../utils";

interface DataItem {
  id: string;
  name: string;
  output: Record<string, string | string[]>;
}

interface ExecutionResultsProps {
  show: boolean;
  onHide: () => void;
  data: DataItem[] | null;
  isLoading: boolean;
}

const ExecutionResults: React.FC<ExecutionResultsProps> = ({ show, onHide, data, isLoading }) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setExpandedIds([data[data.length - 1].id]);
    }
  }, [data]);

  const handleToggle = (id: string) => {
    setExpandedIds(prevIds =>
      prevIds.includes(id) ? prevIds.filter(prevId => prevId !== id) : [...prevIds, id]
    );
  };

  const renderResponseItem = (key: string, value: any) => {
    // Check if the value is an array
    if (Array.isArray(value)) {
      return (
        <div key={key} className="mb-2">
          <strong>{key}:</strong> {value.join(', ')}
        </div>
      );
    }
    // Handle primitive string values
    return (
      <div key={key} className="mb-2 monospace">
        {String(value)}
      </div>
    );
  };

  const renderResponse = (response: Record<string, any>) => {
    return Object.entries(response).map(([key, value]) => renderResponseItem(key, value));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Execution Results</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div>
            {data && data.map(item => (
              <Card key={item.id} className="mb-3 shadow-sm">
                <Card.Header
                  onClick={() => handleToggle(item.id)}
                  style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span className="fw-bold">Node: {underscoreToReadable(item.name)}</span>
                  <Button variant="outline-secondary" size="sm">
                    {expandedIds.includes(item.id) ? 'Collapse' : 'Expand'}
                  </Button>
                </Card.Header>
                {expandedIds.includes(item.id) && (
                  <Card.Body>
                    {renderResponse(item.output)}
                  </Card.Body>
                )}
              </Card>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExecutionResults;