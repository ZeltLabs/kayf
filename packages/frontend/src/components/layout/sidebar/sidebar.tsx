"use client";

import React, { useState, useEffect } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Plus,
    FileText,
    ImageIcon,
    File,
    ChevronRight,
} from "lucide-react";
import { usePages, PageNode, PageType } from "@/hooks/use-pages";
import SidebarTreeItem from "./sidebar-item";

export type NestedPage = PageNode & { childrenNodes: NestedPage[] };

function buildTree(flat: Record<string, PageNode>): NestedPage[] {
    const map: Record<string, NestedPage> = {};
    Object.values(flat).forEach((p) => {
        map[p.id] = { ...p, childrenNodes: [] };
    });
    Object.values(map).forEach((node) => {
        if (node.parentId && map[node.parentId]) {
            map[node.parentId].childrenNodes.push(node);
        }
    });
    return Object.values(map).filter((n) => n.parentId === null);
}

export default function EditorSidebar() {
    const { pages, isLoading, createPage, provider } = usePages("fileTree");
    const [status, setStatus] = useState<"online" | "offline">("offline");
    const tree = React.useMemo(() => buildTree(pages), [pages]);

    useEffect(() => {
        if (!provider) return;
        const onStatus = ({ status }: { status: "connected" | "disconnected" }) => {
            setStatus(status === "connected" ? "online" : "offline");
        };
        provider.on("status", onStatus);
        return () => void provider.off("status", onStatus);
    }, [provider]);

    const handleNew = async (type: PageType) => {
        await createPage(
            null,
            `Untitled ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            type
        );
    };

    const noPages = !isLoading && tree.length === 0;

    return (
        <Sidebar
            variant="inset"
            className="relative h-full grow bg-secondary border rounded shadow-md flex flex-col overflow-hidden"
        >
            <SidebarContent className="flex flex-col flex-1">
                {/* === User Info === */}
                <div className="p-4 space-x-4 flex flex-row items-center">
                    <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="mt-2 text-sm font-semibold">Jane Doe</div>
                        <div className="text-xs text-muted-foreground">
                            {status === "online" ? "Online" : "Offline"}
                        </div>
                    </div>
                </div>

                {/* === Search Button === */}
                <div className="px-3 pb-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 text-sm"
                        onClick={() => alert("Search triggered")}
                    >
                        <Search className="w-4 h-4" />
                        Search
                        <div className="flex-1" />
                        <Badge variant="default">Ctrl + K</Badge>
                    </Button>
                </div>

                {/* === Pages === */}
                {noPages ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm px-4 py-8 gap-4">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <p className="text-center max-w-[180px]">
                            No pages present. Click the button below to get started.
                        </p>
                        <NewPageDropdown onSelect={handleNew} size="sm" />
                    </div>
                ) : (
                    <div className="block">
                        <SidebarTreeSection title="Favorites" defaultOpen={false}>
                            <div className="text-xs text-muted-foreground italic py-1 pl-4">
                                No favorites yet
                            </div>
                        </SidebarTreeSection>

                        <SidebarTreeSection
                            title="Pages"
                            defaultOpen
                            addon={
                                <NewPageDropdown
                                    onSelect={handleNew}
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 size-6"
                                    iconStyle="w-3 h-3 text-muted-foreground"
                                />
                            }
                        >
                            <SidebarMenu className="gap-1 text-sm text-muted-foreground">
                                {tree.map((page) => (
                                    <SidebarTreeItem key={page.id} {...page} />
                                ))}
                            </SidebarMenu>
                        </SidebarTreeSection>
                    </div>
                )}
            </SidebarContent>
        </Sidebar>
    );
}

/**
 * Reusable dropdown for creating a new page.
 */
function NewPageDropdown({
    onSelect,
    size = "sm",
    className = "",
    label = "New…",
    iconStyle = "",
}: {
    onSelect: (type: PageType) => void;
    size?: "sm" | "default" | "icon";
    className?: string;
    label?: string;
    iconStyle?: string;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={size === "icon" ? "ghost" : "default"}
                    size={size}
                    className={`gap-2 ${className}`}
                >
                    <Plus className={`w-4 h-4 ${iconStyle}`} />
                    {size !== "icon" && label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onSelect("document")}>
                    <FileText className={`mr-2 w-4 h-4 ${iconStyle}`} />
                    Document
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelect("canvas")}>
                    <ImageIcon className={`mr-2 w-4 h-4 ${iconStyle}`} />
                    Canvas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelect("file")}>
                    <File className={`mr-2 w-4 h-4 ${iconStyle}`} />
                    File
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * Animated collapsible section for sidebar groupings.
 */
function SidebarTreeSection({
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
