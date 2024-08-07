import { useEffect } from "react";
import axios from "axios";
import { useReactFlow } from "reactflow";
import {underscoreToReadable} from "../utils";
import {useWorkflowStore} from "../store/workflow-store";

export const useWorkflowData = (workflowId: string) => {
    const { setNodes, setEdges } = useReactFlow();
    const {setName} = useWorkflowStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/workflow/${workflowId}`);
                const { nodes, edges, name, latest_run_data } = response.data;

                const workflowNodesArray = nodes.map((node: { node: any; id: any; }) => ({
                    ...node,
                    type: node.node,
                    data: { id: node.id },
                    name: underscoreToReadable(node.node),
                    latest_run_data: latest_run_data
                }));

                const formattedEdges = edges.map((edge: { source: any; target: any; }) => ({
                    ...edge,
                }));
                setNodes(workflowNodesArray);
                setEdges(formattedEdges);
                setName(name);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [workflowId, setNodes, setEdges, setName]);
};