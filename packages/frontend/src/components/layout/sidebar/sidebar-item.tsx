"use client"

import { useState } from "react"
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    ChevronRight,
    FileText,
    MoreHorizontal,
    Plus,
    Image,
    File,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { PageType, usePages } from "@/hooks/use-pages"
import { NestedPage } from "./sidebar"
import { IconPicker } from "@/components/ui/icon-picker"
import { selectedPageIdAtom } from "@/atoms/page-selection"
import { useAtom } from "jotai"
import { RenameDialog } from "@/components/ui/specific/rename-dialog"

export default function SidebarTreeItem({
    id,
    title,
    childrenNodes,
    icon,
}: NestedPage) {
    const { createPage, renamePage, deletePage, updateIcon } = usePages("fileTree")
    const router = useRouter()
    const [selectedPageId, setSelectedPageId] = useAtom(selectedPageIdAtom)
    const isActive = selectedPageId === id
    const [open, setOpen] = useState(false)
    const [renameOpen, setRenameOpen] = useState(false)

    const toggleOpen = () => {
        if (childrenNodes.length > 0) setOpen((o) => !o)
    }

    const handleSelect = () => {
        if (!isActive) setSelectedPageId(id)
    }

    const handleNew = async (type: PageType) => {
        await createPage(id, `Untitled ${type.charAt(0).toUpperCase() + type.slice(1)}`, type)
    }

    const handleDelete = async () => {
        await deletePage(id)
        router.refresh()
    }

    const handleRename = async (newName: string) => {
        await renamePage(id, newName)
    }

    const ChevronIcon = childrenNodes.length > 0 ? ChevronRight : () => <span className="w-6" />
    const isUrl = icon.startsWith("http://") || icon.startsWith("https://")

    return (
        <>
            <SidebarMenuItem>
                <Collapsible open={open} onOpenChange={toggleOpen} className="space-y-1">
                    <SidebarMenuButton
                        asChild
                        className={`flex grow items-center gap-2 group rounded ${isActive ? "bg-muted" : ""}`}
                        onClick={handleSelect} // Single click to select
                    >
                        <div className="flex items-center w-full gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleOpen()
                                }}
                                className="p-1"
                                disabled={childrenNodes.length === 0}
                            >
                                <ChevronIcon className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`} />
                            </button>

                            <IconPicker onApply={(newIcon) => updateIcon(id, newIcon)}>
                                {isUrl ? (
                                    <img src={icon} alt="icon" className="w-5 h-5 object-contain rounded-sm" />
                                ) : (
                                    <span className="text-lg">{icon}</span>
                                )}
                            </IconPicker>

                            <span className="truncate text-sm cursor-default select-none truncate">
                                {title}
                            </span>

                            <div className="flex items-center ml-auto gap-1" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="hover:bg-accent rounded opacity-0 group-hover:opacity-100">
                                            <Plus className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleNew("document")}>
                                            <FileText className="mr-2 w-4 h-4" />
                                            Document
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleNew("canvas")}>
                                            <Image className="mr-2 w-4 h-4" />
                                            Canvas
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleNew("file")}>
                                            <File className="mr-2 w-4 h-4" />
                                            File
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1 hover:bg-accent rounded opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="right">
                                        <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                                            Rename
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleDelete}
                                            className="text-red-500"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </SidebarMenuButton>

                    {childrenNodes.length > 0 && (
                        <CollapsibleContent className="w-full">
                            <SidebarMenuSub className="w-full gap-1 mx-0 px-0 pl-4">
                                {childrenNodes.map((child) => (
                                    <SidebarTreeItem key={child.id} {...child} />
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    )}
                </Collapsible>
            </SidebarMenuItem>

            <RenameDialog
                open={renameOpen}
                onOpenChange={setRenameOpen}
                defaultName={title}
                onConfirm={handleRename}
            />
        </>
    )
}

