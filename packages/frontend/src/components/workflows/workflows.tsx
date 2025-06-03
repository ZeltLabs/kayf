import FlowCanvas from "@/components/workflows/flow-canvas"
import { NodeData } from "@/types/workflows"

export default function WorkflowsProvider({ docId, nodeDefinitions }: { docId: string, nodeDefinitions: NodeData[] }) {
    return (
        <div className="flex h-full w-full bg-secondary border rounded shadow-md flex-col overflow-hidden p-2">
            <div className="h-full w-full rounded-t bg-background overflow-auto">
                <FlowCanvas nodeDefinitions={nodeDefinitions} />
            </div>
        </div>
    )
}
