import { CommandAction, CommandGroupData } from "@/types/command";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Settings, Terminal } from "lucide-react";

export const commandOpenAtom = atom(true);
export const commandLatestItemsAtom = atomWithStorage<CommandAction[]>('command-latest-items', []);

export const commandGroupsAtom = atom<CommandGroupData[]>([
    {
        title: "General",
        items: [
            {
                icon: <Terminal />,
                title: "Open Terminal",
                description: "Launch a terminal",
                keybinding: ["Ctrl", "1"],
                onTrigger: () => console.log("terminal"),
            },
            {
                icon: <Settings />,
                title: "Settings",
                description: "Open settings panel",
                keybinding: ["Ctrl", "2"],
                onTrigger: () => console.log("settings"),
            },
        ],
    },
    {
        title: "Generali",
        items: [
            {
                icon: <Terminal />,
                title: "Open Terminal",
                description: "Launch a terminal",
                keybinding: ["Ctrl", "3"],
                onTrigger: () => console.log("terminal"),
            },
            {
                icon: <Settings />,
                title: "Settings",
                description: "Open settings panel",
                keybinding: ["Ctrl", "4"],
                onTrigger: () => console.log("settings"),
            },
        ],
    }
]);
