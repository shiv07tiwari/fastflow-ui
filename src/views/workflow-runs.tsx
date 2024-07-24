import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Node} from "../types";
import { Card, Spinner } from 'react-bootstrap';
import { MdClose, MdExpandMore, MdExpandLess } from 'react-icons/md';
import {timestampToHumanReadable, underscoreToReadable} from "../utils";

interface WorkflowRun {
    id: string;
    nodes: Node[];
    executed_at: number;
}

interface WorkflowRunsProps {
    workflow_id: string;
    show: boolean;
    onHide: () => void;
}

const WorkflowRuns: React.FC<WorkflowRunsProps> = ({workflow_id,  show, onHide }) => {
    const [runs, setRuns] = useState<WorkflowRun[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedRuns, setExpandedRuns] = useState<string[]>([]);
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

    useEffect(() => {
        if (show) {
            fetchWorkflowRuns();
        }
    }, [show]);

    const fetchWorkflowRuns = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/workflow/${workflow_id}/runs`);
            setRuns(response.data);
            if (response.data.length > 0) {
                setExpandedRuns([response.data[0].run_id]);
            }
        } catch (error) {
            console.error("Error fetching workflow runs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRun = (runId: string) => {
        setExpandedRuns(prev =>
            prev.includes(runId) ? prev.filter(id => id !== runId) : [...prev, runId]
        );
    };

    const toggleNode = (nodeId: string) => {
        setExpandedNodes(prev =>
            prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
        );
    };

    const renderNodeOutputs = (outputs: any) => {
        return Object.entries(outputs).map(([key, value]) => (
            <div key={key} className="mb-2">
                <strong>{key}:</strong> {JSON.stringify(value)}
            </div>
        ));
    };

    const theme = {
        background: '#F8F9FA',
        primary: '#FFFFFF',
        secondary: '#0E6DFC',
        text: '#333333',
        headerText: '#FFFFFF',
        border: '#E0E0E0',
        shadow: 'rgba(0, 0, 0, 0.1)',
    };

    return (
        <div className="d-flex flex-column"
            style={{
                position: 'absolute',
                right: show ? 0 : '-320px',
                top: 0,
                bottom: 0,
                width: '320px',
                backgroundColor: theme.background,
                transition: 'right 0.3s ease',
                zIndex: 1000,
                overflowY: 'auto',
                boxShadow: `-4px 0 12px ${theme.shadow}`,
                borderRadius: '0 12px 12px 0',
            }}
        >
            <div className="d-flex justify-content-between align-items-center p-3"
                style={{ borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.primary }}
            >
                <h5 className="mb-0" style={{ color: theme.text, fontWeight: 600 }}>Workflow Runs</h5>
                <button className="btn btn-link p-0" onClick={onHide} aria-label="Close">
                    <MdClose size={24} color={theme.text} />
                </button>
            </div>

            <div className="overflow-auto flex-grow-1 p-3">
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <Spinner animation="border" role="status" style={{ color: theme.secondary }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    runs.map(run => (
                        <Card key={run.id} className="mb-3"
                            style={{
                                backgroundColor: theme.primary,
                                borderColor: theme.border,
                                boxShadow: `0 2px 8px ${theme.shadow}`,
                            }}
                        >
                            <Card.Header
                                onClick={() => toggleRun(run.id)}
                                style={{ cursor: 'pointer', backgroundColor: theme.background }}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <span className="fw-bold" style={{ color: theme.text }}>{timestampToHumanReadable(run.executed_at)}</span>
                                {expandedRuns.includes(run.id) ? (
                                    <MdExpandLess size={24} color={theme.text} />
                                ) : (
                                    <MdExpandMore size={24} color={theme.text} />
                                )}
                            </Card.Header>
                            {expandedRuns.includes(run.id) && (
                                <Card.Body>
                                    {run.nodes.map(node => (
                                        <Card key={node.id} className="mb-2">
                                            <Card.Header
                                                onClick={() => toggleNode(node.id)}
                                                style={{ cursor: 'pointer', backgroundColor: theme.background }}
                                                className="d-flex justify-content-between align-items-center"
                                            >
                                                <span className="fw-bold" style={{ color: theme.text }}>{underscoreToReadable(node.node)}</span>
                                                {expandedNodes.includes(node.id) ? (
                                                    <MdExpandLess size={20} color={theme.text} />
                                                ) : (
                                                    <MdExpandMore size={20} color={theme.text} />
                                                )}
                                            </Card.Header>
                                            {expandedNodes.includes(node.id) && (
                                                <Card.Body>
                                                    <p>{node.description}</p>
                                                    {renderNodeOutputs(node.outputs)}
                                                </Card.Body>
                                            )}
                                        </Card>
                                    ))}
                                </Card.Body>
                            )}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default WorkflowRuns;