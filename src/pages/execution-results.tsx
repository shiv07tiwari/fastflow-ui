import React, { useState, useEffect } from 'react';
import { Spinner, Card } from 'react-bootstrap';

interface DataItem {
  id: string;
  output: any;
}

interface ExecutionResultsProps {
  onClose: () => void;
  data: DataItem[] | null;
  isLoading: boolean;
}

const ExecutionResults: React.FC<ExecutionResultsProps> = ({ onClose, data, isLoading }) => {
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

  const theme = {
    background: '#FFFFFF',
    primary: '#FFFFFF',
    secondary: '#0E6DFC',
    text: '#000000',
    headerText: '#FFFFFF',
    border: '#90CAF9',
  };

  return (
    <div
      className="d-flex flex-column"
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '300px',
        backgroundColor: theme.background,
        transition: 'right 0.3s',
        zIndex: 5,
        overflowY: 'auto',
        boxShadow: `-2px 0 5px ${theme.border}`,
        margin: '24px',
        padding: '24px',
        borderRadius: '8px',
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 mb-3" style={{ borderBottom: `1px solid ${theme.border}` }}>
        <h5 className="mb-0" style={{ color: theme.text }}>Execution Results</h5>
        <button className="btn-close" onClick={onClose} aria-label="Close"></button>
      </div>
      <div className="overflow-auto flex-grow-1">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" role="status" style={{ color: theme.secondary }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div>
            {data && data.map(item => (
              <Card key={item.id} className="mb-3" style={{ backgroundColor: theme.primary, borderColor: theme.border }}>
                <Card.Header
                  onClick={() => handleToggle(item.id)}
                  style={{ cursor: 'pointer', backgroundColor: theme.secondary, color: theme.headerText }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>ID: {item.id}</span>
                    <span>{expandedIds.includes(item.id) ? '▼' : '▶'}</span>
                  </div>
                </Card.Header>
                {expandedIds.includes(item.id) && (
                  <Card.Body style={{ backgroundColor: theme.primary }}>
                    <Card.Text style={{ whiteSpace: 'pre-wrap', color: theme.text }}>
                        {/*TODO: Display the response here*/}
                      {JSON.stringify(item.output.response, null, 2)}
                    </Card.Text>
                  </Card.Body>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionResults;