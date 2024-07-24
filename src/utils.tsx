import {Node, Edge} from "reactflow";
import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

const elkOptions = {
    "elk.algorithm": "layered",
    "elk.layered.spacing.nodeNodeBetweenLayers": "150", // Increased from 100
    "elk.spacing.nodeNode": "100", // Increased from 80
    "elk.direction": "RIGHT",
    "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
    "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
    "elk.layered.spacing.edgeNodeBetweenLayers": "50", // Added to increase space between edges and nodes
    "elk.spacing.edgeEdge": "50", // Added to increase space between edges
    "elk.layered.spacing.baseValue": "50", // Added as a base spacing value
};

interface LayoutedNode extends Node {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface LayoutedGraph {
    children?: LayoutedNode[];
    edges?: Edge[];
}

export const applyLayout = (nodes: Node[], edges: Edge[], options = elkOptions): Promise<{
    nodes: Node[];
    edges: Edge[]
}> => {
    const isHorizontal = options["elk.direction"] === "RIGHT";

    const graph = {
        id: "root",
        layoutOptions: options,
        children: nodes.map((node) => ({
            ...node,
            targetPosition: isHorizontal ? "left" : "top",
            sourcePosition: isHorizontal ? "right" : "bottom",
            width: 180, // Increased from 150
            height: 60, // Increased from 50
        })),
        edges,
    };

    return elk
        // @ts-ignore
        .layout(graph)
        // @ts-ignore
        .then((layoutedGraph: LayoutedGraph) => {
            if (!layoutedGraph.children) {
                return {nodes, edges};
            }

            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;

            layoutedGraph.children.forEach((node) => {
                minX = Math.min(minX, node.x);
                minY = Math.min(minY, node.y);
                maxX = Math.max(maxX, node.x + node.width);
                maxY = Math.max(maxY, node.y + node.height);
            });

            const graphWidth = maxX - minX;
            const graphHeight = maxY - minY;

            const container = document.querySelector(".react-flow__renderer");
            const containerWidth = container ? container.clientWidth : window.innerWidth;
            const containerHeight = container ? container.clientHeight : window.innerHeight;

            const translateX = (containerWidth - graphWidth) / 2 - minX;
            const translateY = (containerHeight - graphHeight) / 2 - minY;

            return {
                nodes: layoutedGraph.children.map((node) => ({
                    ...node,
                    position: {
                        x: node.x + translateX,
                        y: node.y + translateY,
                    },
                })),
                edges: layoutedGraph.edges || edges,
            };
        })
        .catch((error: Error) => {
            console.error("Layout calculation error:", error);
            return {nodes, edges};
        });
};
export const underscoreToReadable = (text: string) => {
    return text
        .split('_')                     // Split the text at each underscore
        .map(word =>                     // Map each word in the resulting array
            word.charAt(0).toUpperCase() + // Capitalize the first character of the word
            word.slice(1).toLowerCase()  // Convert the rest of the word to lowercase
        )
        .join(' ');                      // Join the words with spaces
}

export const timestampToHumanReadable = (timestamp: number) => {
    console.log(timestamp, new Date(timestamp).toLocaleString());
    return new Date(timestamp).toLocaleString();
}