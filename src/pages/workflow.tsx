import React, {useState, useCallback, useEffect} from 'react';
import ReactFlow, {Controls, Background, MiniMap, useReactFlow} from 'reactflow';
import 'reactflow/dist/style.css';
import {useWorkflowData} from "../hooks/useWorkflowData";
import {useExecuteWorkflow} from "../hooks/useExecuteWorkflow";
import {useReactFlowHandlers} from "../hooks/useStoreHandlers";
import {useWorkflowStore} from "../store/workflow-store";
import {MdPlayArrow, MdReplay, MdAdd} from 'react-icons/md';
import toast, {Toaster} from 'react-hot-toast';
import GeminiNode from "../nodes/gemini-node";
import GeminiRAGNode from "../nodes/gemini-rag-node";
import AvailableNodes from "../views/available-nodes";
import WebScrapperNode from "../nodes/web_scrapper_node";
import ExecutionResults from "../views/execution-results";
import FileReaderNode from "../nodes/file-reader";
import Summarizer from "../nodes/summarizer";
import ZipReaderNode from "../nodes/zip-reader";
import ResumeAnalysisNode from "../nodes/resume-analysis";
import {useNavigate, useParams} from "react-router-dom";
import RedditNode from "../nodes/reddit-node";
import WorkflowRuns from "../views/workflow-runs";
import CompanyEnrichmentNode from "../nodes/company-enrichment";
import UserInputNode from "../nodes/user-input";
import SheetWriterNode from "../nodes/file_processing/sheet-writer";
import ScorerNode from "../nodes/scoring";
import Extractor from "../nodes/extractor";
import CombineTextNode from "../nodes/combine-text";
import YoutubeComments from "../nodes/youtube-comments";
import HumanApproval from "../nodes/human_approval";
import {useUpdateWorkflow} from "../hooks/useUpdateWorkflow";
import Filter from "../nodes/filter";
import {Avatar, Button, Chip, NavbarBrand} from "@nextui-org/react";
import GeminiImageNode from "../nodes/gemini_image";
import GoogleSheetWriterNode from "../nodes/google/google-sheet-writer";
import InvoiceProcessorNode from "../nodes/invoice_processor";
import GmailDraftNode from "../nodes/google/email-draft";
import GoogleSheetReaderNode from "../nodes/google/google-sheet-reader";
import DataAnalysisNode from "../nodes/star/data_analysis";
import FloatButton from 'antd/es/float-button';

const nodeTypes = {
    gemini: GeminiNode,
    combine_text: CombineTextNode,
    web_scraper: WebScrapperNode,
    file_reader: FileReaderNode,
    resume_analysis: ResumeAnalysisNode,
    summarizer: Summarizer,
    zip_reader: ZipReaderNode,
    reddit_bot: RedditNode,
    company_enrichment: CompanyEnrichmentNode,
    user_input: UserInputNode,
    sheet_writer: SheetWriterNode,
    scoring: ScorerNode,
    extractor: Extractor,
    yt_comments: YoutubeComments,
    gemini_rag: GeminiRAGNode,
    human_approval: HumanApproval,
    filter: Filter,
    gemini_image: GeminiImageNode,
    google_sheet_writer: GoogleSheetWriterNode,
    invoice_processor: InvoiceProcessorNode,
    email_draft: GmailDraftNode,
    google_sheet_reader: GoogleSheetReaderNode,
    data_analysis: DataAnalysisNode
};

interface HeaderButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({onClick, icon, label}) => (
    <Button size="sm" onClick={onClick} color="primary" variant="flat">
        {icon}
        {label}
    </Button>
);

const Header: React.FC<{
    onAddNode: () => void;
    onExecuteWorkflow: () => void;
    onToggleWorkflowRun: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onSave: () => void;
    latestRunStatus?: string;
    approverNode?: string;
    onExecuteApproverWorkflow: (nodeId: string) => void;
}> = ({
          onAddNode,
          onExecuteApproverWorkflow,
          onExecuteWorkflow,
          onToggleWorkflowRun,
          onSave,
      }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const {setName, name, owner} = useWorkflowStore();
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        onSave();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return (
        <header className="shadow-sm py-3 pe-3" style={{backgroundColor: "#FFFFFF"}}>
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center">
                    <Button disableRipple disableAnimation variant='light' onClick={() => {
                        navigate('/')
                    }}>
                        <div className="d-flex flex-row">
                            <img src={`/assets/logo.png`} alt={`Logo Icon`} className="mr-3"
                                 style={{width: "32px", height: "32px", "marginRight": '8px'}}/>
                            <h4 className="font-bold text-inherit p-0 mt-2" style={{marginLeft: '-14px'}}>astflow</h4>
                        </div>
                    </Button>

                    <div className="d-flex flex-col align-items-center">
                        {isEditing ? (
                            <input
                                onClick={handleEditClick}
                                type="text"
                                onBlur={handleSaveClick}
                                value={name}
                                onChange={handleInputChange}
                                className="form-control h4 mb-2 me-2"
                                style={{width: '150px'}}
                                autoFocus
                            />
                        ) : (

                            <div className="d-flex flex-row justify-content-center align-items-center">
                                <button onClick={isEditing ? handleSaveClick : handleEditClick}
                                        className="btn btn-sm">
                                    <h5 className=" mb-2 me-2">{name}</h5>
                                </button>
                                {
                                    owner === 'admin' && (
                                        <Chip color="warning" variant="dot">Template</Chip>
                                    )
                                }
                            </div>


                        )}
                    </div>
                    <div className="d-flex gap-2">
                        <HeaderButton onClick={onExecuteWorkflow} icon={<MdPlayArrow size={20}/>} label="Execute"/>
                        <HeaderButton onClick={onToggleWorkflowRun} icon={<MdReplay size={20}/>} label="Previous Runs"/>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Workflow: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    const [isWorkflowRunOpen, setIsWorkflowRunOpen] = useState(false);

    useWorkflowData(id || '');
    const {executeWorkflow, data} = useExecuteWorkflow(id || '');
    const {updateWorkflow} = useUpdateWorkflow(id || '');
    const {onNodesChange, onEdgesChange, onConnect, onAddNode} = useReactFlowHandlers();
    const {nodes, edges, latest_run_data} = useWorkflowStore();

    const latestRunStatus = latest_run_data["status"];
    const latestRunId = latest_run_data["id"];
    const approverNode = latest_run_data["approve_node"];
    const [runId, setRunId] = useState(latestRunId);

    const {zoomIn, zoomOut} = useReactFlow();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleWorkflowRun = () => setIsWorkflowRunOpen(!isWorkflowRunOpen);

    const triggerWorkflow = () => {
        setIsResultsOpen(true);
        const newRunId = Math.random().toString(36).substring(7);
        setRunId(newRunId);
        executeWorkflow(newRunId, undefined);
    };

    const triggerRunFromResultsPage = (nodeId: string) => {
        setIsResultsOpen(true);
        executeWorkflow(runId, nodeId);
    };

    const handleZoomIn = useCallback(() => {
        zoomIn();
    }, [zoomIn]);

    const handleZoomOut = useCallback(() => {
        zoomOut();
    }, [zoomOut]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
                toast.promise(
                    updateWorkflow(),
                    {
                        loading: 'Saving...',
                        success: <b>Workflow Saved! 🎉</b>,
                        error: <b>Failed to save workflow</b>,
                    }
                );
                event.preventDefault();
            }
        },
        [updateWorkflow]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);


    return (
        <div className="workflow-container d-flex flex-column vh-100">
            <Header
                onAddNode={toggleMenu}
                onExecuteWorkflow={triggerWorkflow}
                onExecuteApproverWorkflow={triggerRunFromResultsPage}
                onToggleWorkflowRun={toggleWorkflowRun}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onSave={() => updateWorkflow()}
                latestRunStatus={latestRunStatus}
                approverNode={approverNode}
            />
            <div className="d-flex flex-row h-100">
                <Button
                    style={{margin: '16px', marginLeft: '32px', zIndex: 10000, position: 'absolute'}}
                    isIconOnly
                    onClick={toggleMenu}
                    color="primary"
                    variant="flat"
                >
                    <MdAdd size={64}/>
                </Button>
                <div className="flex-grow-1">
                    {isMenuOpen && (
                        <AvailableNodes onClose={toggleMenu} onSelectNode={onAddNode}/>
                    )}
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        defaultViewport={{x: 800, y: 300, zoom: 0.1}}
                    >
                        <Controls/>
                        <MiniMap style={{marginBottom: '-32px'}}/>
                        <Background/>
                    </ReactFlow>
                </div>
            </div>
            {isWorkflowRunOpen && (
                <WorkflowRuns workflow_id={id || ''} show={isWorkflowRunOpen} onHide={toggleWorkflowRun}/>
            )}
            {isResultsOpen && (
                <ExecutionResults
                    show={isResultsOpen}
                    onHide={() => setIsResultsOpen(false)}
                    runId={runId}
                    finalData={data || undefined}
                    nodes={nodes}
                    edges={edges}
                    onRetry={triggerRunFromResultsPage}
                />
            )}
            <Toaster/>
        </div>
    );
};

export default Workflow;