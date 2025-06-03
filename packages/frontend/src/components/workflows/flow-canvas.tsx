"use client"

import React, { useCallback, useMemo } from "react"
import ReactFlow, {
    Background,
    Controls,
    addEdge,
    useEdgesState,
    useNodesState,
    Connection,
    ReactFlowProvider,
    Node,
    Handle,
    NodeProps,
    Position,
} from "reactflow"
import "reactflow/dist/style.css"
import { NodeData, FieldType } from "@/types/workflows"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface FlowCanvasProps {
    nodeDefinitions: NodeData[]
}

export default function FlowCanvas({ nodeDefinitions }: FlowCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    )

    const nodeTypes = useMemo(() => {
        const map: Record<string, React.FC<NodeProps>> = {}
        for (const node of nodeDefinitions) {
            map[node.id] = createNodeComponent(node)
        }
        return map
    }, [nodeDefinitions])

    return (
        <ReactFlowProvider>
            <div
                className="w-full h-full"
                onDrop={(e) => handleDrop(e, setNodes)}
                onDragOver={(e) => e.preventDefault()}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    nodesDraggable
                    nodesConnectable
                    elementsSelectable
                    defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
                    fitViewOptions={{ padding: 0.5 }}
                    onNodeClick={(e) => e.stopPropagation()}
                >
                    <Controls />
                    <Background color="#1e1e1e" gap={12} />
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    )
}

// === DYNAMIC COMPONENT FACTORY ===

function createNodeComponent(node: NodeData): React.FC<NodeProps> {
    return function NodeComponent() {
        return (
            <div className="p-3 rounded-md border shadow-sm bg-background w-64 space-y-2">
                <div className="text-sm font-semibold">{node.display_name}</div>
                <form className="space-y-2">
                    {node.input.map((field) => {
                        const id = `${node.id}-${field.field}`
                        const isInline = field.type === "checkbox" || field.type === "radio"
                        return (
                            <div key={field.field} className={isInline ? "flex items-center gap-2" : "space-y-1"}>
                                <Label htmlFor={id} className="text-xs text-muted-foreground">
                                    {field.label}
                                </Label>
                                {renderInput(field.type, id)}
                            </div>
                        )
                    })}
                </form>

                <Handle
                    type="target"
                    position={Position.Right}
                    className="!w-1 !h-full !bg-transparent hover:!bg-transparent"
                    style={{ top: 0 }}
                >
                    <div className="absolute top-1/2 left-[-6px] -translate-y-1/2 w-3 h-3 rounded-full border-2 border-muted-foreground bg-background hover:border-primary transition" />
                </Handle>

                <Handle
                    type="source"
                    position={Position.Left}
                    className="!w-1 !h-full !bg-transparent hover:!bg-transparent"
                    style={{ top: 0 }}
                >
                    <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-3 h-3 rounded-full border-2 border-muted-foreground bg-background hover:border-primary transition" />
                </Handle>
            </div>
        )
    }
}

// === SHADCN INPUT RENDERING ===

function renderInput(type: FieldType, id: string) {
    switch (type) {
        case "textarea":
            return <Textarea id={id} rows={3} />
        case "checkbox":
        case "radio":
            return <input id={id} type={type} className="w-4 h-4" />
        default:
            return <Input id={id} type={type} />
    }
}

// === DROP HANDLER ===

function handleDrop(event: React.DragEvent, setNodes: ReturnType<typeof useNodesState>[1]) {
    event.preventDefault()

    const data = event.dataTransfer.getData("application/reactflow")
    if (!data) return

    const { type } = JSON.parse(data)

    const bounds = (event.target as HTMLElement).getBoundingClientRect()
    const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
    }

    const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type, // must match nodeTypes key
        position,
        data: {},
    }

    setNodes((nds) => nds.concat(newNode))
}

