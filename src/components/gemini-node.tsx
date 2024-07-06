import React, {ChangeEvent} from 'react';
import { Handle, Position } from 'reactflow';
import { Card, Form, InputGroup, Row, Col } from "react-bootstrap";
import { FaRobot, FaKeyboard, FaCode } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import { NodeInput, useWorkflowStore } from "../store/workflow-store";

const GeminiNode: React.FC<NodeInput> = ({ data }) => {
  const { updateNodeAvailableInputs } = useWorkflowStore();
  const node = useWorkflowStore().getNodeById(data.id);

  if (!node) {
    throw new Error(`Node with id ${data.id} not found`);
  }

  // @ts-ignore
  const { available_inputs, icon_url, description, output } = node;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateNodeAvailableInputs(data.id, "prompt", e.target.value);
  };

  return (
    <Card className="shadow-sm" style={{ width: "320px", borderRadius: "12px", overflow: "hidden" }}>
      <Handle id="input2" type="target" position={Position.Top} style={{ background: '#4a90e2', width: '12px', height: '12px', left: 6 }} />
      <Handle id="input1" type="target" position={Position.Top} style={{ background: '#4a90e2', width: '12px', height: '12px' }} />
      <Card.Header className="d-flex align-items-center bg-primary text-white py-3">
        <img src={icon_url} alt="Gemini Icon" className="mr-3" style={{ width: "32px", height: "32px" }} />
        <span className="font-weight-bold fs-5">Gemini AI</span>
      </Card.Header>
      <Card.Body className="bg-light">
        <Card.Text className="text-muted mb-3">{description}</Card.Text>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="text-primary"><FaKeyboard className="mr-2" /> Prompt</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white">
                <FaRobot />
              </InputGroup.Text>
              <Form.Control
                as="textarea"
                placeholder="Enter your prompt"
                value={available_inputs.prompt || ''}
                onChange={handleInputChange}
                className="border-left-0"
                style={{ height: '120px', resize: 'none' }}
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </Card.Body>
      <Card.Footer className="bg-white border-top">
        <Row>
          <Col sm={12}>
            <small className="text-muted d-flex align-items-center"><FaCode className="mr-2" /> Output:</small>
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
      <Handle type="source" position={Position.Bottom} style={{ background: '#4a90e2', width: '12px', height: '12px' }} />
    </Card>
  );
};

export default GeminiNode;