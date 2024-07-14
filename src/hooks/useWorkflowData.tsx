import { useEffect } from "react";
import axios from "axios";
import { useReactFlow } from "reactflow";
import {applyLayout, underscoreToReadable} from "../utils";

export const useWorkflowData = (workflowId: string) => {
    const { setNodes, setEdges } = useReactFlow();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/workflow/${workflowId}`);
                const { nodes, edges } = response.data;

                const workflowNodesArray = nodes.map((node: { node: any; id: any; }) => ({
                    ...node,
                    type: node.node,
                    data: { id: node.id },
                    name: underscoreToReadable(node.node),
                }));

                const formattedEdges = edges.map((edge: { source: any; target: any; }) => ({
                    ...edge,
                    id: `${edge.source}-${edge.target}`
                }));

                applyLayout(workflowNodesArray, formattedEdges).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
                    setNodes(layoutedNodes);
                    setEdges(layoutedEdges);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [workflowId, setNodes, setEdges]);
};