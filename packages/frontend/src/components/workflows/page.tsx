"use client"

import Header from "@/components/layout/header";
import EditorSidebar from "@/components/layout/sidebar/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import NodeSelector from "@/components/workflows/node-selector";
import WorkflowsProvider from "@/components/workflows/workflows"
import { DownloadIcon, MessageSquareIcon, TypeIcon } from "lucide-react";

export default function Workflows() {
    return (
        <main className="flex flex-row grow p-4 overflow-hidden space-x-4">
            <SidebarProvider className="min-h-0 w-fit p-0 flex h-full">
                <EditorSidebar />
            </SidebarProvider>
            <div className="flex flex-col grow space-y-[1em]">
                <Header />
                <WorkflowsProvider docId="random" />
            </div>
            <SidebarProvider className="min-h-0 w-fit p-0 flex h-full">
                <NodeSelector categories={[
                    {
                        id: "inputs",
                        label: "Inputs",
                        nodes: [
                            { id: "chat", name: "Chat Input", description: "Message prompt input", icon: <MessageSquareIcon /> },
                            { id: "text", name: "Text Input", description: "Single-line or multi-line", icon: <TypeIcon /> },
                        ],
                    },
                    // More...
                ]} />
            </SidebarProvider>
        </main>
    );
}
