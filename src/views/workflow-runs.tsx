import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Node} from "../types";
import { MdClose } from 'react-icons/md';
import {timestampToHumanReadable, underscoreToReadable} from "../utils";
import {Accordion, AccordionItem, Button, Spinner} from "@nextui-org/react";
import {ResultsTable} from "./execution-results";

interface WorkflowRun {
    id: string;
    nodes: Node[];
    executed_at: number;
    status: string;
    approve_node?: string;
}

interface WorkflowRunsProps {
    workflow_id: string;
    show: boolean;
    onHide: () => void;
}

export const InfoIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="32"
    role="presentation"
    viewBox="0 0 24 24"
    width="32"
    {...props}
  >
    <path
      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M12 8V13"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M11.9945 16H12.0035"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const AIIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
            d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
            fill="#3B82F6"/>
    </svg>
);

// @ts-ignore
export const ResultAccordion = ({runs}) => {
    const itemClasses = {
        base: "py-0 w-full",
        title: "font-normal text-medium",
        trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
        indicator: "text-medium",
        content: "text-small px-2",
    };

    const renderNodeOutputs = (outputs: any) => {
        return <ResultsTable value={outputs} widthRatio={200}/>
    };

    return (
        <Accordion selectionMode="multiple" itemClasses={itemClasses}>
        {
                runs.map((run: WorkflowRun) => {
                    const isWaitingForApproval = run.status === "WAITING_FOR_APPROVAL";
                    const title = isWaitingForApproval
                        ? "Waiting for approval"
                        : ` Done at ${timestampToHumanReadable(run.executed_at)}`;
                    return (
                        <AccordionItem
                            key={run.id}
                            aria-label={run.id}
                            startContent={
                                run.status === "WAITING_FOR_APPROVAL" ?
                                    <InfoIcon className="text-warning" />
                                    : <AIIcon className="text-danger"/>
                            }
                            subtitle={`${run.nodes.length} nodes`}
                            title={title}
                        >
                            <Accordion selectionMode="multiple" isCompact variant="bordered">
                                {run.nodes.map(node => (
                                    <AccordionItem
                                        key={node.id}
                                        aria-label={node.id}
                                        subtitle={node.description}
                                        title={underscoreToReadable(node.node)}
                                    >
                                        <>
                                            <p>{node.description}</p>
                                                {renderNodeOutputs(node.outputs)}
                                        </>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                            {
                                isWaitingForApproval && (
                                    <Button
                                        color="warning"
                                        className="mt-3 align-content-end w-100"
                                        // isLoading={isRetried}
                                        onClick={() => console.log('node')}
                                    >
                                        Approve
                                    </Button>
                                )
                            }
                        </AccordionItem>
                    );
                })
            }
        </Accordion>
    );
};

const WorkflowRuns: React.FC<WorkflowRunsProps> = ({workflow_id,  show, onHide }) => {
    const [runs, setRuns] = useState<WorkflowRun[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWorkflowRuns = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/workflow/${workflow_id}/runs`);
            setRuns(response.data);
        } catch (error) {
            console.error("Error fetching workflow runs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (show) {
            fetchWorkflowRuns();
        }
    }, [show]);


    const theme = {
        background: '#FFFFFF',
        primary: '#FFFFFF',
        secondary: '#0E6DFC',
        text: '#333333',
        headerText: '#FFFFFF',
        border: '#E0E0E0',
        shadow: 'rgba(0, 0, 0, 0.1)',
    };

    return (
        <div className="d-flex flex-column"
             style={{
                 position: 'absolute',
                 right: show ? 0 : '-320px',
                 top: 85,
                 bottom: 0,
                 width: '420px',
                 backgroundColor: theme.background,
                 transition: 'right 0.3s ease',
                 zIndex: 1000,
                 overflowY: 'auto',
                 boxShadow: `-4px 0 12px ${theme.shadow}`,
                 borderRadius: '0 12px 12px 0',
             }}
        >
            <div className="d-flex justify-content-between align-items-center p-3"
                 style={{borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.primary}}
            >
                <h5 className="mb-0" style={{color: theme.text, fontWeight: 600}}>Workflow Runs</h5>
                <button className="btn btn-link p-0" onClick={onHide} aria-label="Close">
                    <MdClose size={24} color={theme.text}/>
                </button>
            </div>

            <ResultAccordion runs={runs}/>

            {
                isLoading && (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <Spinner size="sm" className="ms-2"/>
                    </div>
                )
            }
        </div>
    );
};

export default WorkflowRuns;