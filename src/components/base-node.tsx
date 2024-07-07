import React from 'react';
import {Handle, Position} from 'reactflow';
import {Card, Form, InputGroup, Row, Col} from "react-bootstrap";
import {FaCode} from "react-icons/fa";
import {useWorkflowStore} from "../store/workflow-store";
import {Node} from "../types";

export interface BaseNodeProps {
    title: string;
    inputLabel: string;
    inputIcon: React.ReactNode;
    inputType?: string;
    data: Node;
}

const BaseNode: React.FC<BaseNodeProps> = ({data, title, inputLabel, inputIcon, inputType = "text"}) => {
    const {updateNodeAvailableInputs, getNode} = useWorkflowStore();
    const node = getNode(data.id);

    if (!node) {
        // https://github.com/xyflow/xyflow/issues/2548
        // React Flow has a bug where after deleting a node, it still tries to render it
        return null;
    }

    const {available_inputs, icon_url, description, output} = node;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeAvailableInputs(data.id, inputType === "text" ? "prompt" : "url", e.target.value);
    };

    return (
        <Card className="shadow-sm" style={{width: "320px", borderRadius: "12px", overflow: "hidden"}}>
            <Handle id="input1" type="target" position={Position.Top}
                    style={{background: '#4a90e2', width: '12px', height: '12px'}}/>
            <Card.Header className="d-flex align-items-center bg-primary text-white py-3">
                <img src={icon_url} alt={`${title} Icon`} className="mr-3" style={{width: "32px", height: "32px"}}/>
                <span className="font-weight-bold fs-5">{title}</span>
            </Card.Header>
            <Card.Body className="bg-light">
                <Card.Text className="text-muted mb-3">{description}</Card.Text>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-primary">{inputLabel}</Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="bg-white">
                                {inputIcon}
                            </InputGroup.Text>
                            <Form.Control
                                as={inputType === "text" ? "textarea" : "input"}
                                placeholder={inputType === "text" ? "Enter your prompt" : "Enter URL to scrape"}
                                value={available_inputs[inputType === "text" ? "prompt" : "url"] || ''}
                                onChange={handleInputChange}
                                className="border-left-0"
                                style={inputType === "text" ? {height: '120px', resize: 'none'} : {}}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form>
            </Card.Body>
            <Card.Footer className="bg-white border-top">
                <Row>
                    <Col sm={12}>
                        <small className="text-muted d-flex align-items-center"><FaCode
                            className="mr-2"/> Output:</small>
                    </Col>
                    <Col sm={12}>
            <pre
                className="mt-2 p-2 bg-light rounded"
                style={{
                    fontSize: '0.8rem',
                    maxHeight: '100px',
                    overflowY: 'auto',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef'
                }}
            >
              {JSON.stringify(output, null, 2)}
            </pre>
                    </Col>
                </Row>
            </Card.Footer>
            <Handle type="source" position={Position.Bottom}
                    style={{background: '#4a90e2', width: '12px', height: '12px'}}/>
        </Card>
    );
};

export default BaseNode;