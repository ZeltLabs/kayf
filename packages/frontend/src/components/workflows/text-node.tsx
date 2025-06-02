"use client"

import { Handle, Position, NodeProps } from "reactflow"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function TextNode({ id, data }: NodeProps) {
  return (
    <div className="bg-[#1f1f1f] text-white p-3 rounded-md border border-gray-600 w-64"> 
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold text-md">Text Input</div> 
            <div className="text-xs text-gray-300">From Playground</div> 
          </div>
          <Handle 
            type="target" 
            position={Position.Left} 
            className="!w-2.5 !h-2.5 !bg-gray-400 !rounded-full !mt-1"  
          />
        </div>

        <Textarea
          placeholder="Type..."
          className="bg-gray-700 border-gray-600 text-white text-sm h-20"
        />


        <Button className="w-full h-8 text-sm bg-primary hover:bg-slate-100"> 
          Message
        </Button>
      </div>
    </div>
  )
}