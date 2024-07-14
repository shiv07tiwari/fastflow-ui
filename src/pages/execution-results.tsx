import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Accordion, Spinner } from 'react-bootstrap';

interface DataItem {
  id: string;
  output: {
    response: Record<string, any> | string;
  };
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
    if (typeof value === 'object' && value !== null) {
      return (
        <Accordion key={key}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>{key}</Accordion.Header>
            <Accordion.Body>
              {Object.entries(value).map(([subKey, subValue]) => renderResponseItem(`${key}.${subKey}`, subValue))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      );
    }
    return (
      <div key={key} className="mb-2">
        <strong>{key}:</strong> {String(value)}
      </div>
    );
  };

  const renderResponse = (response: Record<string, any> | string) => {
    if (typeof response === 'string') {
      return <pre className="mb-0">{response}</pre>;
    }
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
                  <span className="fw-bold">ID: {item.id}</span>
                  <Button variant="outline-secondary" size="sm">
                    {expandedIds.includes(item.id) ? 'Collapse' : 'Expand'}
                  </Button>
                </Card.Header>
                {expandedIds.includes(item.id) && (
                  <Card.Body>
                    {renderResponse(item.output.response)}
                  </Card.Body>
                )}
              </Card>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExecutionResults;