import { useEffect } from "react";
import axios from "axios";
import { useReactFlow } from "reactflow";
import {underscoreToReadable} from "../utils";
import {useWorkflowStore} from "../store/workflow-store";

export const useWorkflowData = (workflowId: string) => {
    const { setNodes, setEdges } = useReactFlow();
    const {setName, setLatestRunData, setOwner} = useWorkflowStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/workflow/${workflowId}`);
                const { nodes, edges, name, latest_run_data, owner } = response.data;

                const workflowNodesArray = nodes.map((node: { node: any; id: any; }) => ({
                    ...node,
                    type: node.node,
                    data: { id: node.id },
                    name: underscoreToReadable(node.node),
                }));

                const formattedEdges = edges.map((edge: { source: any; target: any; }) => ({
                    ...edge,
                }));
                setNodes(workflowNodesArray);
                setEdges(formattedEdges);
                setName(name);
                setLatestRunData(latest_run_data);
                setOwner(owner);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [workflowId, setNodes, setEdges, setName]);
};