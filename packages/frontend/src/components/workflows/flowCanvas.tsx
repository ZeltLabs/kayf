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
                    fitView
                >
                    <MiniMap nodeColor={() => '#222'} maskColor="rgba(255,255,255,0.1)" />
                    <Controls />
                    <Background color="#1e1e1e" gap={12} />
                </ReactFlow>
            </DropHandler>
        </ReactFlowProvider>
    )
}
