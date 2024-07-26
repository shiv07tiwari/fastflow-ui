import React from 'react';
import {Card, Form, InputGroup, Spinner} from "react-bootstrap";
import {useWorkflowStore} from "../store/workflow-store";
import {BaseNodeInput, Node} from "../types";
import NodeHandle from "./node-handle";
import {UploadStatus} from "../hooks/useHandleFileUpload";
import {underscoreToReadable} from "../utils";

interface InputProps {
    key: string;
    inputLabel: string;
    inputType?: string;
    enabled?: boolean;
}

export interface BaseNodeProps {
    title: string;
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
                                               icon
                                           }) => {
    const {getNode, edges} = useWorkflowStore();
    const node = getNode(data.id);

    if (!node) {
        // https://github.com/xyflow/xyflow/issues/2548
        // React Flow has a bug where after deleting a node, it still tries to render it
        return null;
    }

    const { external_inputs, output_handles, internal_inputs, common_inputs } = node;

    const connectedExternalInputHandles = edges.filter(edge => edge.target === data.id).map(edge => edge.targetHandle);
    const inputHandles = [...external_inputs, ...common_inputs].map(input => input.key);
    const internalInputs = [...internal_inputs, ...common_inputs].map((input: BaseNodeInput) => {
        return {
            key: input.key,
            inputLabel: underscoreToReadable(input.key),
            inputType: input.input_type,
            enabled: !connectedExternalInputHandles.includes(input.key)  // Disable if connected to handle
        }
    });

    const renderInput = (input: InputProps) => {
        const {key, inputType, inputLabel} = input;
        const {available_inputs} = node;
        if (inputType === 'file') {
            return (
                <>
                    <input disabled={!input.enabled} type="file" onChange={(e) => {
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
                        disabled={!input.enabled}
                        as={inputType === "text" ? "textarea" : "input"}
                        placeholder={`Enter your ${inputLabel}`}
                        value={available_inputs[key] || ''}
                        onChange={(e) => handleInputChange(e, key)}
                        className="border-left-0"
                        // style={inputType === "text" ? {height: '60px', resize: 'none'} : {}}
                    />
                </InputGroup>
            );
        }
    };

    return (
        <Card className="shadow-sm bg-light" style={{width: "320px", borderRadius: "12px"}}>
            <NodeHandle handles={inputHandles} type="target"/>
            <Card.Header className="d-flex align-items-center bg-primary text-white py-3">
                <img src={`/node-icons/${icon}`} alt={`${title} Icon`} className="mr-3"
                     style={{width: "32px", height: "32px", "marginRight": '8px'}}/>
                <span className="font-weight-bold fs-5">{node.name}</span>
            </Card.Header>
            <Card.Body className="bg-light">
                <Form>
                    <Form.Group className="mb-3">
                        {
                            internalInputs.map((input, index) => (
                                <>
                                    <Form.Label key={index}>{input.inputLabel}</Form.Label>
                                    {renderInput(input)}
                                    <div className="mb-3" />
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