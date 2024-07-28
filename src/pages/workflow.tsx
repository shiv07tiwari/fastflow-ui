import React, {useState} from 'react';
import ReactFlow, {Controls, Background, MiniMap} from 'reactflow';
import 'reactflow/dist/style.css';
import {useWorkflowData} from "../hooks/useWorkflowData";
import {useExecuteWorkflow} from "../hooks/useExecuteWorkflow";
import {useReactFlowHandlers} from "../hooks/useStoreHandlers";
import {useWorkflowStore} from "../store/workflow-store";
import {MdPlayArrow, MdMenu, MdClose, MdReplay} from 'react-icons/md';
import GeminiNode from "../nodes/gemini-node";
import TextNode from "../nodes/text-node";
import AvailableNodes from "../views/available-nodes";
import WebScrapperNode from "../nodes/web_scrapper_node";
import ExecutionResults from "../views/execution-results";
import FileReaderNode from "../nodes/file-reader";
import Summarizer from "../nodes/summarizer";
import ZipReaderNode from "../nodes/zip-reader";
import ResumeAnalysisNode from "../nodes/resume-analysis";
import {useParams} from "react-router-dom";
import RedditNode from "../nodes/reddit-node";
import WorkflowRuns from "../views/workflow-runs";
import CompanyEnrichmentNode from "../nodes/company-enrichment";
import UserInputNode from "../nodes/user-input";
import SheetWriterNode from "../nodes/file_processing/sheet-writer";
import ScorerNode from "../nodes/scoring";

const nodeTypes = {
    gemini: GeminiNode,
    combine_text: TextNode,
    web_scraper: WebScrapperNode,
    file_reader: FileReaderNode,
    resume_analysis: ResumeAnalysisNode,
    summarizer: Summarizer,
    zip_reader: ZipReaderNode,
    reddit_bot: RedditNode,
    company_enrichment: CompanyEnrichmentNode,
    user_input: UserInputNode,
    sheet_writer: SheetWriterNode,
    scoring: ScorerNode
};

interface StyledButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

const StyledButton: React.FC<StyledButtonProps> = ({onClick, children, icon, variant = 'primary'}) => (
    <button
        onClick={onClick}
        className={`btn btn-${variant} me-2 d-flex align-items-center cursor-pointer`}
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
    const {id} = params;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    const [isWorkflowRunOpen, setIsWorkflowRunOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleWorkflowRun = () => setIsWorkflowRunOpen(!isWorkflowRunOpen);
    useWorkflowData(id || '');
    const {executeWorkflow, isLoading, data} = useExecuteWorkflow(id || '');
    const {onNodesChange, onEdgesChange, onConnect, onAddNode} = useReactFlowHandlers();
    const {nodes, edges} = useWorkflowStore();

    const triggerWorkflow = () => {
        setIsResultsOpen(true);
        executeWorkflow();
    }

    return (
        <div className="workflow-container" style={{width: '100vw', height: '100vh', position: 'relative'}}>
            <div className="d-flex w-100 justify-content-between px-3 py-3 border-2 p-4">
                <StyledButton onClick={toggleMenu}
                              icon={isMenuOpen ? <MdClose size={18}/> : <MdMenu size={18}/>}>
                    {'Add Node'}
                </StyledButton>
                <StyledButton onClick={triggerWorkflow} icon={<MdPlayArrow size={18}/>}>
                    Execute Workflow
                </StyledButton>
                <StyledButton onClick={toggleWorkflowRun} icon={<MdReplay size={18}/>}>
                    See Previous Runs
                </StyledButton>
            </div>
            <div className="content" style={{display: 'flex', height: 'calc(100vh - 60px)'}}>
                {isMenuOpen && (
                    <AvailableNodes onClose={toggleMenu} onSelectNode={onAddNode}/>
                )}
                <div className="react-flow-wrapper" style={{flexGrow: 1}}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                    >
                        <Controls/>
                        <MiniMap/>
                        <Background/>
                    </ReactFlow>
                </div>
            </div>
            {
                isWorkflowRunOpen &&
                <WorkflowRuns workflow_id={id || ''} show={isWorkflowRunOpen} onHide={toggleWorkflowRun}/>
            }

            {isResultsOpen && (
                <ExecutionResults show={isResultsOpen} onHide={() => setIsResultsOpen(false)} data={data}
                                  isLoading={isLoading}/>
            )}
        </div>
    );
};

export default Workflow;