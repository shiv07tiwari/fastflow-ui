import React, { useState } from 'react';
import ReactFlow, { Controls, Background, BackgroundVariant, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowData } from "../hooks/useWorkflowData";
import { useExecuteWorkflow } from "../hooks/useExecuteWorkflow";
import { useReactFlowHandlers } from "../hooks/useStoreHandlers";
import { useWorkflowStore } from "../store/workflow-store";
import { MdPlayArrow, MdMenu, MdClose } from 'react-icons/md';
import GeminiNode from "../components/gemini-node";
import TextNode from "../components/text-node";
import AvailableNodes from "./available-nodes";
import WebScrapperNode from "../components/web_scrapper_node";
import ExecutionResults from "./execution-results";
import FileReaderNode from "../components/file-reader";
import Summarizer from "../components/summarizer";
import ZipReaderNode from "../components/zip-reader";
import ResumeAnalysisNode from "../components/resume-analysis";
import {useParams} from "react-router-dom";

const nodeTypes = {
  gemini: GeminiNode,
  combine_text: TextNode,
  web_scraper: WebScrapperNode,
  file_reader: FileReaderNode,
  resume_analysis: ResumeAnalysisNode,
  summarizer: Summarizer,
  zip_reader: ZipReaderNode,
};

interface StyledButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const StyledButton: React.FC<StyledButtonProps> = ({ onClick, children, icon, variant = 'primary' }) => (
  <button
    onClick={onClick}
    className={`btn btn-${variant} me-2 d-flex align-items-center`}
    style={{
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '4px',
      fontWeight: 'bold',
      padding: '0.5rem 1rem',
      transition: 'all 0.3s ease',
    }}
  >
    {icon && <span className="me-2">{icon}</span>}
    {children}
  </button>
);

interface WorkflowProps {
}

const Workflow: React.FC<WorkflowProps> = () => {
  const params = useParams();
  const { id } = params;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  useWorkflowData(id || '');
  const { executeWorkflow, isLoading, data } = useExecuteWorkflow(id || '');
  const { onNodesChange, onEdgesChange, onConnect, onAddNode } = useReactFlowHandlers();
  const { nodes, edges } = useWorkflowStore();

  const triggerWorkflow = () => {
    setIsResultsOpen(true);
    executeWorkflow();
  }

  return (
    <div className="workflow-container" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div className="d-flex m-3 w-100 justify-content-center">
          <StyledButton onClick={toggleMenu} icon={isMenuOpen ? <MdClose size={18} /> : <MdMenu size={18} />}>
            {'Add Node'}
          </StyledButton>
          <StyledButton onClick={triggerWorkflow} icon={<MdPlayArrow size={18} />}>
            Execute Workflow
          </StyledButton>
      </div>

      <div className="content" style={{ display: 'flex', height: 'calc(100vh - 60px)', marginTop: '60px' }}>
        {isMenuOpen && (
          <div className="sidebar" style={{ width: '250px', backgroundColor: '#f8f9fa', borderRight: '1px solid #dee2e6', overflowY: 'auto' }}>
            <AvailableNodes onClose={toggleMenu} onSelectNode={onAddNode} />
          </div>
        )}
        <div className="react-flow-wrapper" style={{ flexGrow: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          >
            <Controls />
            <MiniMap />
            <Background />
          </ReactFlow>
        </div>
      </div>

      {isResultsOpen && (
        <ExecutionResults show={isResultsOpen} onHide={() => setIsResultsOpen(false)} data={data} isLoading={isLoading} />
      )}
    </div>
  );
};

export default Workflow;