import React, {useState, useEffect} from 'react';
import {Modal, Button, Card} from 'react-bootstrap';
import {MdCheckCircle, MdExpandMore, MdExpandLess} from 'react-icons/md';
import {orderNodesByDFS, underscoreToReadable} from "../utils";
import {Node} from "../types";
import {Edge} from "reactflow";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    Spinner,
} from "@nextui-org/react";
import Markdown from "react-markdown";

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


interface Props {
    value: Record<string, any>[]; // specify a more precise type according to your data structure
}

const KeyValueTable: React.FC<Props> = ({value}) => {
    if (typeof value !== 'object' || value === null) {
        // Optionally handle non-object types or return null or some fallback UI.
        return null;
    }

    const tableHeaders = Object.keys(value[0]);
    console.log("Table Headers: ", value)
    // Add all table headers to the columns array
    const columns = tableHeaders.map((header) => ({key: header, label: underscoreToReadable(header)}));
    const data = value.map((row: any, index: any) => (
        {
            key: index,
            ...row
        }
    ));

    return (
        <Table aria-label="Example table with dynamic content" >
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={data}>
                {(item) => (
                    <TableRow key={item.key}>
                        {(columnKey) => <TableCell><Markdown>{getKeyValue(item, columnKey)}</Markdown></TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

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

    const renderResponse = (response: Record<string, any>[]) => {
        return <KeyValueTable value={response}/>
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Execution Results</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{maxHeight: '70vh', overflowY: 'auto'}}>
                {orderedNodes.map(node => (
                    <Card key={node.id} className="mb-3 shadow-sm">
                        <Card.Header
                            onClick={() => handleToggle(node.id)}
                            style={{cursor: 'pointer', backgroundColor: '#FFFFF'}}
                            className="d-flex justify-content-between align-items-center"
                        >
                            <div className="fw-bold" style={{color: "#333F50"}}>{underscoreToReadable(node.node)}</div>
                            <div className="d-flex align-items-center">
                                {receivedResults.has(node.id) && (
                                    <MdCheckCircle className="text-success me-2" size={20}/>
                                )}
                                {receivedResults.has(node.id) ? (
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="d-flex align-items-center"
                                    >
                                        {expandedIds.includes(node.id) ? (
                                            <>
                                                <MdExpandLess className="me-1"/> Collapse
                                            </>
                                        ) : (
                                            <>
                                                <MdExpandMore className="me-1"/> Expand
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Spinner />
                                )}
                            </div>
                        </Card.Header>
                        {receivedResults.has(node.id) && expandedIds.includes(node.id) && (
                            <Card.Body>
                                {renderResponse(receivedResults.get(node.id)?.outputs || [])}
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