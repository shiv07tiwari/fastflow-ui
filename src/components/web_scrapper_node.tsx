import React from "react";
import { Card, Form, InputGroup } from "react-bootstrap";
import { FaGlobe, FaLink, FaCode } from "react-icons/fa";
import { Handle, Position } from 'reactflow';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NodeInput, useWorkflowStore } from "../store/workflow-store";

const WebScrapperNode: React.FC<NodeInput> = ({ data }) => {
  const { updateNodeAvailableInputs } = useWorkflowStore();
  const id = data.id;
  const node = useWorkflowStore().getNodeById(data.id);
  if (!node) {
    throw new Error(`Node with id ${id} not found`);
  }
  // @ts-ignore
  const { available_inputs, icon_url, description, output } = node;
  console.log(available_inputs)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeAvailableInputs(data.id, "url", e.target.value);
  };

  return (
    <Card className="shadow-sm" style={{ width: "320px", borderRadius: "12px", overflow: "hidden" }}>
      <Handle type="target" position={Position.Top} style={{ background: '#4a90e2', width: '12px', height: '12px' }} />

      <Card.Header className="d-flex align-items-center bg-primary text-white py-3">
        <img
          src={icon_url}
          alt="Web Scrapper Icon"
          className="mr-3"
          style={{ width: "32px", height: "32px" }}
        />
        <span className="font-weight-bold fs-5">Web Scraper</span>
      </Card.Header>

      <Card.Body className="bg-light">
        <Card.Text className="text-muted mb-3">{description}</Card.Text>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="text-primary"><FaLink className="mr-2" /> Website URL</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white">
                <FaGlobe />
              </InputGroup.Text>
              <Form.Control
                placeholder="Enter URL to scrape"
                value={available_inputs.url || ''}
                onChange={handleInputChange}
                className="border-left-0"
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </Card.Body>

      <Card.Footer className="bg-white border-top">
        <small className="text-muted d-flex align-items-center">
          <FaCode className="mr-2" /> Output:
        </small>
        <pre className="mt-2 p-2 bg-light rounded" style={{ fontSize: '0.8rem', maxHeight: '100px', overflowY: 'auto' }}>
          {JSON.stringify(output, null, 2)}
        </pre>
      </Card.Footer>

      <Handle type="source" position={Position.Bottom} style={{ background: '#4a90e2', width: '12px', height: '12px' }} />
    </Card>
  );
};

export default WebScrapperNode;