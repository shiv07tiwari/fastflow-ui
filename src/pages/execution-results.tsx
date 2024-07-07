import React, { useState, useEffect } from 'react';
import { Spinner, Card } from "react-bootstrap";

// Define the structure of individual data items
interface DataItem {
    id: string;
    output: any;  // Define more specific type based on your data structure
}

// Props type definition
interface ExecutionResultsProps {
    onClose: () => void;
    data: DataItem[] | null;
    isLoading: boolean;
}

const ExecutionResults: React.FC<ExecutionResultsProps> = ({ onClose, data, isLoading }) => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    // Automatically expand the last item when data changes
    useEffect(() => {
        if (data && data.length > 0) {
            setExpandedIds([data[data.length - 1].id]);
        }
    }, [data]);

    const handleToggle = (id: string) => {
        setExpandedIds(prevIds => {
            if (prevIds.includes(id)) {
                // If the id is already in the expandedIds array, remove it (collapse card)
                return prevIds.filter(prevId => prevId !== id);
            } else {
                // Add the id to the expandedIds array (expand card)
                return [...prevIds, id];
            }
        });
    };

    return (
        <div className="d-flex flex-column h-100" style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '300px',
            backgroundColor: 'white', transition: 'right 0.3s', zIndex: 5,
            overflowY: 'auto', boxShadow: '-2px 0 5px rgba(0,0,0,0.1)', margin: '24px', padding: '24px'
        }}>
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="mb-0">Execution Results</h5>
                <button className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="overflow-auto flex-grow-1">
                {isLoading ? (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    <ul className="list-group list-group-flush">
                        {data && data.map(item => (
                            <Card key={item.id} style={{ marginBottom: '10px' }}>
                                <Card.Header onClick={() => handleToggle(item.id)} style={{ cursor: 'pointer' }}>
                                    ID: {item.id}
                                </Card.Header>
                                {expandedIds.includes(item.id) && (
                                    <Card.Body>
                                        <Card.Text>
                                            Output: {JSON.stringify(item.output["response"])}
                                        </Card.Text>
                                    </Card.Body>
                                )}
                            </Card>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ExecutionResults;