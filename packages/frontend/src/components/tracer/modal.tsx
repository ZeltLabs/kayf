"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Delete, MessageSquare, Mic, Search } from "lucide-react";
import { useAtom } from "jotai";
import { tracerOpenAtom } from "@/atoms/tracer";
import { useState } from "react";
import { format, addDays } from "date-fns";
import { DateRange } from "react-day-picker";

const searchResults = [
    { id: 1, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Product Demo Kickoff – 01.08.2024" },
    { id: 2, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Pitch Deck – Kayf AI Search" },
    { id: 3, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Live Demo Notes – 15.09.2024" },
    { id: 4, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Tech Pitch Final – 2024" },
    { id: 5, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "VC Pitch Preparation – June 2024" },
    { id: 6, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Product Demo – Internal Review" },
    { id: 7, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Kayf Investor Pitch 10.2024" },
    { id: 8, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Demo Feedback Round 1" },
    { id: 9, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Pitch Training – Slides & Notes" },
    { id: 10, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Product Walkthrough Script" },
    { id: 11, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Demo Checklist – v1.3" },
    { id: 12, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Final Pitch – Jugend Innovativ" },
    { id: 13, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Demo Plan – Q3 Launch" },
    { id: 14, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Product Demo Script – Beta Review" },
    { id: 15, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Investor Deck – May Revision" },
    { id: 16, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Pitch Outline – GCER 2025" },
    { id: 17, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Product Demo v2 – Flowchart" },
    { id: 18, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Demo Meeting Agenda – 07.2024" },
    { id: 19, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Kayf Overview – Elevator Pitch" },
    { id: 20, icon: "https://numericcitizen.me/content/images/size/w1200/wp-content/uploads/2020/04/notion-logo.302c0d9f08f849f0805891d0c2b9b563.png", title: "Team Feedback – Pitch Round 2" }
];

function SearchBar({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
    return (
        <div className="flex items-center space-x-3">
            <button className="bg-secondary transition ring-ring/50 ring-[3px] rounded-lg p-2 shadow-sm hover:shadow-[0_0_10px_var(--tw-ring-color)] focus:shadow-[0_0_10px_var(--tw-ring-color)] active:scale-95">
                <Search className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="bg-secondary transition ring-ring/50 ring-[3px] rounded-lg p-2 shadow-sm hover:shadow-[0_0_10px_var(--tw-ring-color)] focus:shadow-[0_0_10px_var(--tw-ring-color)] active:scale-95">
                <Mic className="h-4 w-4 text-muted-foreground" />
            </button>
            <Input
                placeholder="Search..."
                className="flex-1 bg-transparent focus-visible:ring-0 shadow-none outline-none border-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
                <Button variant="secondary" onClick={() => setQuery("")}>
                    <Delete className="h-4 w-4 text-muted-foreground" />
                </Button>
            )}
        </div>
    );
}

function Filters({
    query,
    date,
    setDate,
    selectedLLM,
    setSelectedLLM,
    selectedProviders,
    toggleProvider,
    llmOptions,
    providerOptions,
}: {
    query: string;
    date: DateRange | undefined;
    setDate: (d: DateRange | undefined) => void;
    selectedLLM: string;
    setSelectedLLM: (v: string) => void;
    selectedProviders: string[];
    toggleProvider: (v: string) => void;
    llmOptions: string[];
    providerOptions: string[];
}) {
    return (
        <div className="flex items-center space-x-2 mt-3">
            <Select value={selectedLLM} onValueChange={setSelectedLLM}>
                <SelectTrigger className="w-[8em]">
                    <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                    {llmOptions.map((opt, i) => (
                        <SelectItem key={`tracer-llm-selection-${opt}-${i}`} value={opt}>{opt}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center justify-start w-[21em]">
                <MessageSquare className="h-4 w-4" />
                <span className="overflow-hidden text-ellipsis">
                    Q/A: {query || "Search for answers using a model"}
                </span>
            </Button>

            <div className="flex-1" />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[6em] px-[2em] text-center">
                        Provider
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {providerOptions.map((provider, i) => (
                        <DropdownMenuCheckboxItem
                            key={`tracer-provider-selection-${provider}-${i}`}
                            checked={selectedProviders.includes(provider)}
                            onCheckedChange={() => toggleProvider(provider)}
                        >
                            {provider}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="min-w-[6em] px-[2em] text-center">
                        {date?.from && date?.to
                            ? `${format(date.from, "PP")} - ${format(date.to, "PP")}`
                            : date?.from
                                ? format(date.from, "PP")
                                : "When"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Calendar mode="range" selected={date} onSelect={setDate} />
                </PopoverContent>
            </Popover>
        </div>
    );
}

function Results() {
    return (
        <ScrollArea className="mt-1 flex-1 overflow-scroll">
            <div className="space-y-2 mr-2">
                {searchResults.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center space-x-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-secondary transition"
                    >
                        <img className="w-[1em] h-[1em]" src={item.icon} alt="Provider icon" />
                        <p className="text-sm text-foreground">{item.title}</p>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}

function Footer() {
    return (
        <DialogFooter className="sm:justify-start items-center">
            <p className="text-xs">Tracer by <b>ZeltLabs</b>.</p>
            <div className="flex-1" />
            <DialogClose asChild>
                <Button size="sm" variant="secondary">
                    Close
                </Button>
            </DialogClose>
        </DialogFooter>
    );
}

export default function Tracer() {
    const [visible, setVisible] = useAtom(tracerOpenAtom);
    const [query, setQuery] = useState("");
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 3),
    });
    const llmOptions = ["ChatGPT", "Gemini", "Llama"];
    const providerOptions = ["Notion", "Google", "Dropbox"];

    const [selectedLLM, setSelectedLLM] = useState("ChatGPT");
    const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

    const toggleProvider = (provider: string) => {
        setSelectedProviders((prev) => {
            if (prev.includes(provider)) {
                return [...prev.filter((e) => e != provider)]
            }
            return [...prev, provider]
        });
    };

    return (
        <Dialog open={visible} onOpenChange={setVisible}>
            <DialogContent showCloseButton={false} className="flex flex-col min-w-[70vw] max-w-[80vw] min-h-[80vh] max-h-[80vh] px-4 pr-2 py-2 pb-4 gap-2">
                <DialogHeader>
                    <DialogTitle hidden>Tracer Enterprise Search</DialogTitle>
                    <DialogDescription hidden>
                        AI-powered enterprise search - Tracer by ZeltLabs.
                    </DialogDescription>
                </DialogHeader>

                <div className="mr-2">
                    <SearchBar query={query} setQuery={setQuery} />
                    <Filters
                        query={query}
                        date={date}
                        setDate={setDate}
                        selectedLLM={selectedLLM}
                        setSelectedLLM={setSelectedLLM}
                        selectedProviders={selectedProviders}
                        toggleProvider={toggleProvider}
                        llmOptions={llmOptions}
                        providerOptions={providerOptions}
                    />
                </div>
                <Results />
                <div className="mr-2">
                    <Footer />
                </div>
            </DialogContent>
        </Dialog>
    );
}
