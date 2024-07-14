import React, {useState} from 'react';
import ReactFlow, {Controls, Background, BackgroundVariant, MiniMap} from 'reactflow';
import 'reactflow/dist/style.css';
import {useWorkflowData} from "../hooks/useWorkflowData";
import {useExecuteWorkflow} from "../hooks/useExecuteWorkflow";
import {useReactFlowHandlers} from "../hooks/useStoreHandlers";
import {useWorkflowStore} from "../store/workflow-store";
import GeminiNode from "../components/gemini-node";
import TextNode from "../components/text-node";
import AvailableNodes from "./available-nodes";
import WebScrapperNode from "../components/web_scrapper_node";
import ExecutionResults from "./execution-results";
import FileReaderNode from "../components/file-reader";
import Summarizer from "../components/summarizer";

const nodeTypes = {
    gemini: GeminiNode,
    combine_text: TextNode,
    web_scraper: WebScrapperNode,
    file_reader: FileReaderNode,
    resume_analysis: FileReaderNode,
    summarizer: Summarizer,
};

// @ts-ignore
const StyledButton = ({onClick, children}) => (
    <button
        onClick={onClick}
        className="btn btn-primary me-2"
        style={{
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            fontWeight: 'bold',
        }}
    >
        {children}
    </button>
);

// @ts-ignore
const Workflow = ({workflowId}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useWorkflowData(workflowId);
    const {executeWorkflow, isLoading, data} = useExecuteWorkflow(workflowId);
    const {onNodesChange, onEdgesChange, onConnect, onAddNode} = useReactFlowHandlers();
    const {nodes, edges} = useWorkflowStore();

    const triggerWorkflow = () => {
        setIsResultsOpen(true);
        executeWorkflow();
    }

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <div style={{position: 'absolute', top: 10, left: 500, zIndex: 4}}>
                <StyledButton onClick={toggleMenu}>
                    {isMenuOpen ? 'Close Menu' : 'Open Menu'}
                </StyledButton>
                <StyledButton onClick={triggerWorkflow}>Execute Workflow</StyledButton>
            </div>
            {isMenuOpen && <AvailableNodes onClose={toggleMenu} onSelectNode={onAddNode}/>}
            {
                isResultsOpen && (
                    <ExecutionResults
                        show={isResultsOpen}
                        onHide={() => setIsResultsOpen(false)}
                        data={data}
                        isLoading={isLoading}
                    />
                )
            }
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
                <Background variant={BackgroundVariant.Cross} gap={12} size={1} color={'red'}/>
            </ReactFlow>

        </div>
    );
};

export default Workflow;