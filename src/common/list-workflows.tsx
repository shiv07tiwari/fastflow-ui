import React, {useState, useEffect} from 'react';
import {
    Card,
    CardHeader,
    CardBody, Spinner, AvatarGroup, Avatar, Input
} from '@nextui-org/react';
import axios from 'axios';
import {Node} from "../types";
import {Edge} from "reactflow";
import {useNavigate} from "react-router-dom";
import {MdSearch} from "react-icons/md";

interface Workflow {
    id: string;
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
    ai_description: string;
}

interface ListProps {
    email?: string;
}

const ListWorkflows: React.FC<ListProps> = ({email}) => {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchWorkflows = async () => {
            const owner = email || 'admin';
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/workflows/${owner}`);
                setWorkflows(response.data);
                setError('');
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching the workflows.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkflows();
    }, [email]);

    const filteredWorkflows = workflows.filter((workflow) => {
        return (workflow.name || 'No Name').toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div>
            {
                isLoading ? (
                    <div><Spinner/></div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <div>
                        <Input
                            autoFocus={false}
                            classNames={{
                                base: "max-w-full sm:max-w-[10rem] h-12 mb-3",
                                mainWrapper: "h-full",
                                input: "text-medium",
                                inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                            }}
                            placeholder="Type to search..."
                            size="sm"
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            startContent={<MdSearch size={24} className="search-icon" color="black"/>}
                            type="search"
                        />
                        {filteredWorkflows.map((workflow) => {
                            const nodes = workflow.nodes;
                            const nodeIds = nodes.map((node) => node.node);
                            return (
                                <Card isPressable onClick={() => {
                                    navigate(`/workflow/${workflow.id}`)
                                }} key={workflow.name} style={{marginBottom: '24px', width: '100%', padding: '8px'}}>
                                    <CardHeader
                                        className="d-flex flex-col justify-content-start align-items-start pt-3">
                                        <div
                                            className="d-flex flex-row justify-content-between align-items-start w-100">
                                            <div className="align-items-start">
                                                <h5>{workflow.name}</h5>
                                            </div>
                                            <AvatarGroup isBordered className="mx-3" size="sm">
                                                {
                                                    nodeIds.map((nodeId) => {
                                                        const imageSrc = `node-icons/${nodeId}.png`;
                                                        return (
                                                            <Avatar key={nodeId} src={imageSrc}/>
                                                        )
                                                    })
                                                }
                                            </AvatarGroup>
                                        </div>
                                    </CardHeader>
                                    <CardBody className="mb-2">
                                        <div>{workflow.ai_description}</div>
                                    </CardBody>
                                </Card>
                            )
                        })
                        }
                    </div>
                )
            }
        </div>
    );
};

export default ListWorkflows;