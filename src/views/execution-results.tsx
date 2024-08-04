import React, {useState, useEffect} from 'react';
import { Modal, Button, Card, Spinner } from 'react-bootstrap';
import { MdCheckCircle, MdExpandMore, MdExpandLess } from 'react-icons/md';
import {orderNodesByDFS, underscoreToReadable} from "../utils";
import { Node } from "../types";
import {Edge} from "reactflow";
import Markdown from 'react-markdown'

interface WorkflowRun {
    id: string;
    workflow_id: string;
    num_nodes: number;
    nodes: Node[];
    edges: { source: string, target: string }[];
    started_at: number | null;
    executed_at: number | null;
    status: string | null;
}

interface ExecutionResultsProps {
    show: boolean;
    onHide: () => void;
    runId: string;
    finalData?: WorkflowRun;
    nodes: Node[];
    edges: Edge[];
}

const ExecutionResults: React.FC<ExecutionResultsProps> = ({
    show,
    onHide,
    runId,
    finalData,
    nodes,
    edges,
}) => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [receivedResults, setReceivedResults] = useState<Map<string, Node>>(new Map());

    // From the nodes and edges, we can determine the order of execution
    const orderedNodes = orderNodesByDFS(nodes, edges);

    const updateReceivedResults = (nodes: Node[]) => {
        setReceivedResults(prevMap => {
            const newMap = new Map(prevMap);
            nodes.forEach(node => {
                if (node.id) {
                    newMap.set(node.id, node);
                }
            });
            return newMap;
        });
    };

    useEffect(() => {
        const url = `ws://localhost:8000/result/${runId}`;
        const ws = new WebSocket(url);

        ws.onmessage = (e) => {
            const message = JSON.parse(e.data) as WorkflowRun;
            console.log("Received message: ", message);
            updateReceivedResults(message.nodes);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [runId]);

    useEffect(() => {
        if (finalData) {
            updateReceivedResults(finalData.nodes);
            setExpandedIds([finalData.nodes[finalData.nodes.length - 1].id]);
        }
    }, [finalData]);

    const handleToggle = (id: string) => {
        setExpandedIds(prevIds =>
            prevIds.includes(id) ? prevIds.filter(prevId => prevId !== id) : [...prevIds, id]
        );
    };

    const renderResponseItem = (key: string, value: any) => {
        if (Array.isArray(value)) {
            return (
                <div key={key} className="mb-2">
                    <strong>{key}:</strong> {value.join(', ')}
                </div>
            );
        }
        if (typeof value === 'object') {
            return (
                <div key={key} className="mb-2">
                    {Object.entries(value).map(([k, v]) => (
                        <div key={k} className="mb-2 monospace">
                            <strong>{k}:</strong>
                            <Markdown>
                                {String(v)}
                            </Markdown>

                        </div>
                    ))}
                </div>
            );
        }
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
            <Modal.Body style={{maxHeight: '70vh', overflowY: 'auto'}}>
                {orderedNodes.map(node => (
                    <Card key={node.id} className="mb-3 shadow-sm">
                        <Card.Header
                            onClick={() => handleToggle(node.id)}
                            style={{cursor: 'pointer', backgroundColor: '#f8f9fa'}}
                            className="d-flex justify-content-between align-items-center"
                        >
                            <span className="fw-bold">{underscoreToReadable(node.node)}</span>
                            <div className="d-flex align-items-center">
                                {receivedResults.has(node.id) && (
                                    <MdCheckCircle className="text-success me-2" size={20} />
                                )}
                                {receivedResults.has(node.id) ? (
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="d-flex align-items-center"
                                    >
                                        {expandedIds.includes(node.id) ? (
                                            <>
                                                <MdExpandLess className="me-1" /> Collapse
                                            </>
                                        ) : (
                                            <>
                                                <MdExpandMore className="me-1" /> Expand
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Spinner animation="border" role="status" size="sm">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                )}
                            </div>
                        </Card.Header>
                        {receivedResults.has(node.id) && expandedIds.includes(node.id) && (
                            <Card.Body>
                                {renderResponse(receivedResults.get(node.id)?.outputs || {})}
                            </Card.Body>
                        )}
                    </Card>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ExecutionResults;