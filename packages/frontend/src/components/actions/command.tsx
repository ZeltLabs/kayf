"use client";

import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandGroup,
    CommandItem,
    CommandEmpty,
} from "@/components/ui/command";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import { useAtom } from "jotai";
import { commandOpenAtom, commandGroupsAtom } from "@/atoms/command";
import React from "react";

function CommandRow({
    item,
    itemKey,
    onSelect,
}: {
    item: {
        icon?: React.ReactNode;
        title: string;
        description?: string;
        keybinding?: string[];
        onTrigger: () => void;
    };
    itemKey: string;
    onSelect: () => void;
}) {
    return (
        <CommandItem
            key={itemKey}
            onSelect={onSelect}
            className="h-full w-full px-10"
        >
            <Tooltip>
                <TooltipTrigger className="flex grow items-center gap-3">
                    <span className="text-lg">{item.icon}</span>

                    <div className="flex flex-col text-left">
                        <span>{item.title}</span>
                    </div>

                    {item.keybinding?.length > 0 && (
                        <div className="ml-auto space-x-2">
                            {item.keybinding.map((key, index) => (
                                <React.Fragment key={`${itemKey}-kb-${index}`}>
                                    {index > 0 && <span>+</span>}
                                    <Badge
                                        variant="outline"
                                        className="font-mono text-xs opacity-70"
                                    >
                                        {key}
                                    </Badge>
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </TooltipTrigger>

                <TooltipContent side="top">
                    {item.description}
                </TooltipContent>
            </Tooltip>
        </CommandItem>
    );
}

// === Main Component: Command ===
export function Command() {
    const [open, setOpen] = useAtom(commandOpenAtom);
    const [groups] = useAtom(commandGroupsAtom);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search commands..." />

            <CommandList>
                <CommandEmpty>No matching command found.</CommandEmpty>

                <TooltipProvider>
                    {groups.map((group, groupIndex) => (
                        <CommandGroup
                            key={`command-group-${groupIndex}`}
                            heading={group.title}
                        >
                            {group.items.map((item, itemIndex) => (
                                <CommandRow
                                    key={`command-row-${groupIndex}-${itemIndex}`}
                                    itemKey={`command-row-${groupIndex}-${itemIndex}`}
                                    item={item}
                                    onSelect={() => {
                                        item.onTrigger();
                                        setOpen(false);
                                    }}
                                />
                            ))}
                        </CommandGroup>
                    ))}
                </TooltipProvider>
            </CommandList>
        </CommandDialog>
    );
}
