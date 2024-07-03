import React from "react";
import { Card, Form, InputGroup } from "react-bootstrap";
import { FaGlobe } from "react-icons/fa";
import { Handle, Position } from 'reactflow';
import 'bootstrap/dist/css/bootstrap.min.css';

interface NodeData {
  available_inputs: any;
  required_inputs: any;
  output: any;
  url: string;
  name: string;
  description: string;
}

interface InputNodeProps {
  data: NodeData;
}

const WebScrapperNode: React.FC<InputNodeProps> = ({ data }) => {
  return (
    <Card className="mb-3" style={{ width: "300px" }}>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />

      <Card.Header className="d-flex align-items-center bg-primary text-white">
        <img
          src={data.url}
          alt="Web Scrapper Icon"
          className="mr-2"
          style={{ width: "24px", height: "24px" }}
        />
        <span className="font-weight-bold">{data.name}</span>
      </Card.Header>

      <Card.Body>
        <Card.Text>{data.description}</Card.Text>
        <Form>
          <Form.Group>
            <Form.Label>Website URL</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaGlobe />
              </InputGroup.Text>
              <Form.Control
                type="url"
                placeholder="Enter URL to scrape"
                value={data.available_inputs.url}
                readOnly
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </Card.Body>

      <Card.Footer className="text-muted">
        Output: {JSON.stringify(data.output)}
      </Card.Footer>

      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </Card>
  );
};

export default WebScrapperNode;