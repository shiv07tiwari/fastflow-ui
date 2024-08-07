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
}

const BaseNode: React.FC<BaseNodeProps> = ({
                                               data,
                                               title,
                                               handleInputChange,
                                               status,
                                           }) => {
    const {getNode, edges} = useWorkflowStore();
    const node = getNode(data.id);

    if (!node) {
        // https://github.com/xyflow/xyflow/issues/2548
        // React Flow has a bug where after deleting a node, it still tries to render it
        return null;
    }

    const {external_inputs, output_handles, internal_inputs, common_inputs} = node;

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
        const {key, inputType, inputLabel, enabled} = input;
        const {available_inputs} = node;
        if (inputType === 'file') {
            return (
                <>
                    <input disabled={!enabled} type="file" onChange={(e) => {
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
                    <div>{node.available_inputs['file_path']}</div>
                </>
            )
        } else {
            return (
                <InputGroup>
                    {
                        !enabled && (
                            // <div className="d-flex flex-row mt-3 align-items-center">
                            //     <img src={`/assets/done.png`} alt={`${title} Icon`} className="mr-3"
                            //          style={{width: "32px", height: "32px", "marginRight": '8px'}}/>
                            //     <div className="fs-5 ms-2">{`${inputLabel} connected!`}</div>
                            // </div>
                            <div className="d-flex flex-column w-100 mt-3">
                                <div className="fw-bold mb-3">{`${input.inputLabel} `}</div>
                                <Form.Control
                                    disabled={true}
                                    as={inputType === "text" ? "textarea" : "input"}
                                    placeholder={``}
                                    value={available_inputs[key] || ''}
                                    onChange={(e) => handleInputChange(e, key)}
                                    className="border-left-0"
                                    style={inputType === "text" ? {height: '12px', resize: 'none'} : {}}
                                />
                            </div>
                        )
                    }
                    {
                        enabled && (
                            <div className="d-flex flex-column w-100 mt-3">
                                <div className="fw-bold mb-2">{input.inputLabel}</div>
                                <Form.Control
                                    as={inputType === "text" ? "textarea" : "input"}
                                    placeholder={`Enter your ${inputLabel}`}
                                    value={available_inputs[key] || ''}
                                    onChange={(e) => handleInputChange(e, key)}
                                    className="border-left-0"
                                    style={inputType === "large-text" ? {height: '120px', resize: 'none'} : {}}
                                />
                            </div>

                        )
                    }
                </InputGroup>
            );
        }
    };

    return (
        <>
            <Card className="shadow-sm" style={{width: "320px", borderRadius: "12px"}}>
                <NodeHandle handles={inputHandles} type="target"/>
                <Card.Header className="d-flex align-items-center text-white py-3" style={{backgroundColor: "#8AAAE5"}}>
                    <img src={`/node-icons/${node.node}.png`} alt={`${title} Icon`} className="mr-3"
                         style={{width: "32px", height: "32px", "marginRight": '8px'}}/>
                    <span className="font-weight-bold fs-5" style={{color: "black"}}>{node.name}</span>
                </Card.Header>
                <Card.Body className="">
                    <Form>
                        <Form.Group className="mb-3">
                            {
                                internalInputs.map((input, index) => (
                                    <>
                                        {renderInput(input)}
                                        <div className="mb-3"/>
                                    </>

                                ))
                            }
                        </Form.Group>
                    </Form>
                </Card.Body>
                <NodeHandle handles={output_handles} type="source"/>
            </Card>
        </>
    );
};

export default BaseNode;