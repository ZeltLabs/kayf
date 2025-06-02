"use client"

import { Handle, Position, NodeProps } from "reactflow"
import { MessagesSquare, Type } from 'lucide-react';

export default function ChatNode({ id, data }: NodeProps) {
  return (
    <div className="bg-[#1f1f1f] text-white p-3 rounded-md border border-gray-600 w-40 text-center relative">
      <div className="font-bold text-md flex gap-4"><MessagesSquare></MessagesSquare>Chat Input</div>
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2.5 !h-2.5 !bg-gray-400 !rounded-full absolute right-0 top-1/2" 
      />
    </div>
  )
}