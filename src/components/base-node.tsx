import React from 'react';
import {Card, Form, InputGroup, Spinner} from "react-bootstrap";
import {useWorkflowStore} from "../store/workflow-store";
import {Node} from "../types";
import NodeHandle from "./node-handle";
import {UploadStatus} from "../hooks/useHandleFileUpload";

interface InputProps {
    key: string;
    inputLabel: string;
    inputType?: string;
}

export interface BaseNodeProps {
    title: string;
    inputs: InputProps[];
    data: Node;
    handleInputChange: (e: React.ChangeEvent<any>, key: string) => void;
    status?: UploadStatus;
    icon?: string;
}

const BaseNode: React.FC<BaseNodeProps> = ({
                                               data,
                                               title,
                                               handleInputChange,
                                               status,
                                               inputs,
                                               icon
                                           }) => {
    const {getNode} = useWorkflowStore();
    const node = getNode(data.id);

    if (!node) {
        // https://github.com/xyflow/xyflow/issues/2548
        // React Flow has a bug where after deleting a node, it still tries to render it
        return null;
    }

    const { input_handles, output_handles} = node;

    const renderInput = (input: InputProps) => {
        const {key, inputType} = input;
        const {available_inputs} = node;
        if (inputType === 'file') {
            return (
                <>
                    <input type="file" onChange={(e) => {
                        handleInputChange(e, key);
                    }} className="form-control"/>
                    {
                        status === 'uploading' && (
                            <Spinner as="span" animation="border" size="sm" className="mt-16"/>
                        )
                    }
                    {
                        status === 'successful' && (
                            <span className="text-success mt-32">File uploaded successfully</span>
                        )
                    }
                </>
            )
        } else {
            return (
                <InputGroup>
                    <Form.Control
                        as={inputType === "text" ? "textarea" : "input"}
                        placeholder={`Enter your ${key}`}
                        value={available_inputs[key] || ''}
                        onChange={(e) => handleInputChange(e, key)}
                        className="border-left-0"
                        style={inputType === "text" ? {height: '120px', resize: 'none'} : {}}
                    />
                </InputGroup>
            );
        }
    };

    return (
        <Card className="shadow-sm bg-light" style={{width: "320px", borderRadius: "12px"}}>
            <NodeHandle handles={input_handles} type="target"/>
            <Card.Header className="d-flex align-items-center bg-primary text-white py-3">
                <img src={`/node-icons/${icon}`} alt={`${title} Icon`} className="mr-3"
                     style={{width: "32px", height: "32px", "marginRight": '8px'}}/>
                <span className="font-weight-bold fs-5">{node.name}</span>
            </Card.Header>
            <Card.Body className="bg-light">
                <Form>
                    <Form.Group className="mb-3">
                        {
                            inputs.map((input, index) => (
                                <>
                                    <Form.Label key={index}>{input.inputLabel}</Form.Label>
                                    {renderInput(input)}
                                </>

                            ))
                        }
                    </Form.Group>
                </Form>
            </Card.Body>
            <NodeHandle handles={output_handles} type="source"/>
        </Card>
    );
};

export default BaseNode;