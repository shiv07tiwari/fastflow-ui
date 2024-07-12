import React from 'react';
import {Handle, Position} from 'reactflow';
import {Card, Form, InputGroup} from "react-bootstrap";
import {useWorkflowStore} from "../store/workflow-store";
import {Node} from "../types";
import NodeHandle from "./node-handle";

export interface BaseNodeProps {
    title: string;
    inputLabel: string;
    inputIcon: React.ReactNode;
    inputType?: string;
    data: Node;
    handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileUpload?: () => void;
}

const BaseNode: React.FC<BaseNodeProps> = ({
                                               data,
                                               title,
                                               inputLabel,
                                               inputIcon,
                                               inputType = "text",
                                               handleInputChange,
                                               handleFileUpload
                                           }) => {
    const {getNode} = useWorkflowStore();
    const node = getNode(data.id);

    if (!node) {
        // https://github.com/xyflow/xyflow/issues/2548
        // React Flow has a bug where after deleting a node, it still tries to render it
        return null;
    }

    const {icon_url, input_handles, output_handles } = node;

    const renderInput = () => {
        const {available_inputs} = node;
        if (inputType === 'file') {
            return (
                <>
                    <input type="file" onChange={handleInputChange} className="form-control"/>
                    <button onClick={(e) => {
                        e.preventDefault();
                        handleFileUpload?.()
                    }}>
                        Upload File
                    </button>
                </>
            )
        } else {
            return (
                <InputGroup>
                    <InputGroup.Text className="bg-white">{inputIcon}</InputGroup.Text>
                    <Form.Control
                        as={inputType === "text" ? "textarea" : "input"}
                        placeholder={inputType === "text" ? "Enter your prompt" : "Enter URL to scrape"}
                        value={available_inputs[inputType === "text" ? "prompt" : "url"] || ''}
                        onChange={handleInputChange}
                        className="border-left-0"
                        style={inputType === "text" ? {height: '120px', resize: 'none'} : {}}
                    />
                </InputGroup>
            );
        }
    };

    return (
        <Card className="shadow-sm" style={{width: "320px", borderRadius: "12px", overflow: "hidden"}}>
            <NodeHandle handles={input_handles} type="target" />
            <Card.Header className="d-flex align-items-center bg-primary text-white py-3">
                <img src={icon_url} alt={`${title} Icon`} className="mr-3"
                     style={{width: "32px", height: "32px", "marginRight": '8px'}}/>
                <span className="font-weight-bold fs-5">{node.name}</span>
            </Card.Header>
            <Card.Body className="bg-light">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-primary">{inputLabel}</Form.Label>
                        {renderInput()}
                    </Form.Group>
                </Form>
            </Card.Body>
            <NodeHandle handles={output_handles} type="source" />

        </Card>
    );
};

export default BaseNode;