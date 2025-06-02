import FlowCanvas from "@/components/workflows/flowCanvas"

export default function WorkflowsProvider({ docId }: { docId: string }) {
  return (
    <div className="flex h-full w-full bg-secondary border rounded shadow-md flex-col overflow-hidden p-2">
      <div className="h-full w-full rounded-t bg-background overflow-auto">
        <FlowCanvas />
      </div>
    </div>
  )
}