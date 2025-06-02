"use client"

import { useState } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NodeEntry {
    id: string
    icon: React.ReactNode
    name: string
    description: string
}

interface NodeCategory {
    id: string
    label: string
    nodes: NodeEntry[]
}

function SidebarSection({
    title,
    children,
    defaultOpen,
    addon,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    addon?: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen ?? true);

    return (
        <div className="px-3 group">
            <Collapsible open={open} onOpenChange={setOpen}>
                <div className="flex items-center justify-between">
                    <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                        <ChevronRight className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`} />
                        {title}
                    </CollapsibleTrigger>
                    {addon}
                </div>
                <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down">
                    {children}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}

export default function NodeSelector({ categories }: { categories: NodeCategory[] }) {
    return (
        <Sidebar variant="inset" className="relative h-full grow bg-secondary border rounded shadow-md flex flex-col overflow-hidden">
            <SidebarContent className="flex flex-col flex-1">
                <ScrollArea className="h-full pr-2">
                    {categories.map((cat) => (
                        <SidebarSection
                            key={cat.id}
                            title={cat.label}
                        >
                            <SidebarMenu className="gap-1 text-sm text-muted-foreground">
                                {cat.nodes.map((node) => (
                                    <NodeSidebarItem key={node.id} node={node} />
                                ))}
                            </SidebarMenu>
                        </SidebarSection>
                    ))}
                </ScrollArea>
            </SidebarContent>
        </Sidebar>
    )
}

function NodeSidebarItem({ node }: { node: NodeEntry }) {
    const handleDragStart = (event: React.DragEvent) => {
        const dragData = {
            id: node.id,
            name: node.name,
            type: node.id, 
        }

        event.dataTransfer.setData("application/reactflow", JSON.stringify(dragData))
        event.dataTransfer.effectAllowed = "move"
    }

    return (
        <SidebarMenuItem
            className="group flex items-center gap-3 p-3 h-16 rounded-md bg-primary/5 hover:bg-primary/10 transition overflow-hidden cursor-move"
            draggable
            onDragStart={handleDragStart}
        >
            <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary flex items-center justify-center">
                {node.icon}
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
                <div className="font-medium text-foreground truncate leading-tight">
                    {node.name}
                </div>
                <div className="text-xs text-muted-foreground truncate leading-snug">
                    {node.description}
                </div>
            </div>
        </SidebarMenuItem>
    )
}