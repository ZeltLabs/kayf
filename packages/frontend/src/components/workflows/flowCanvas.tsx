import React, { useCallback } from "react"
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    useEdgesState,
    useNodesState,
    Connection,
    ReactFlowProvider,
    Node,
} from "reactflow"
import "reactflow/dist/style.css"
import DropHandler from "./drophandler"
import TextNode from "./text-node"
import ChatNode from "./chat-node"

const initialNodes: Node<any, string | undefined>[] = []
const initialEdges: any[] = []

export default function FlowCanvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    )

    return (
        <ReactFlowProvider>
            <DropHandler setNodes={setNodes}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={{
                        text: TextNode,
                        chat: ChatNode
                    }}
                    nodesDraggable={true}
                    nodesConnectable={true}
                    elementsSelectable={true}
                    fitView
                    fitViewOptions={{
                        padding: 0.5,
                        maxZoom: 1,  // Standard-Zoom-Level begrenzen
                        duration: 0  // Sofortiges Zoomen ohne Animation
                    }}
                    defaultViewport={{ 
                        x: 0, 
                        y: 0, 
                        zoom: 0.7  // Start mit herausgezoomter Ansicht
                    }}
                    onNodeClick={(e) => e.stopPropagation()} 
                >
                    <Controls />
                    <Background color="#1e1e1e" gap={12} />
                </ReactFlow>
            </DropHandler>
        </ReactFlowProvider>
    )
}