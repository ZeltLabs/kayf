"use client"

import { useCallback } from "react"
import { useReactFlow, Node } from "reactflow"

export default function DropHandler({
    children,
    setNodes,
}: {
    children: React.ReactNode
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>
}) {
    const { project } = useReactFlow()

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
    }, [])

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault()

            const reactFlowBounds = event.currentTarget.getBoundingClientRect()
            const data = event.dataTransfer.getData("application/reactflow")
            if (!data) return

            const nodeData = JSON.parse(data)

            const position = project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            })

            const newNode = {
                id: `${nodeData.id}-${+new Date()}`,
                type: "default",
                position,
                data: { label: nodeData.name },
                style: {
                    background: "#1f1f1f",
                    color: "#fff",
                    border: "1px solid #444",
                },
            }

            setNodes((nds) => nds.concat(newNode))
        },
        [project, setNodes]
    )

    return (
        <div
            style={{ width: "100%", height: "100%" }}
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            {children}
        </div>
    )
}
