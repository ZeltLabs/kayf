"use client"

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { selectedPageIdAtom } from "@/atoms/page-selection";
import { SidebarProvider } from "@/components/ui/sidebar";
import EditorSidebar from "@/components/layout/sidebar/sidebar";
import Header from "@/components/layout/header";
import Editor from "@/components/editor/editor";

export default function AppWrapper() {
    const [selectedPageId, setSelectedPageId] = useAtom(selectedPageIdAtom);
    const searchParams = useSearchParams();
    const router = useRouter();

    // On mount, read the ID from the URL
    useEffect(() => {
        const urlId = searchParams.get("id");
        if (urlId && urlId !== selectedPageId) {
            setSelectedPageId(urlId);
        } else if (!urlId && selectedPageId) {
            router.replace(`/?id=${selectedPageId}`);
        }
    }, []);

    // Whenever the atom changes, update the URL (if needed)
    useEffect(() => {
        const currentId = searchParams.get("id");
        if (selectedPageId && currentId !== selectedPageId) {
            router.replace(`/?id=${selectedPageId}`);
        }
    }, [selectedPageId]);

    return (
      <main className="flex flex-row grow p-4 overflow-hidden space-x-4">
            <SidebarProvider className="min-h-0 w-fit p-0 flex h-full">
                <EditorSidebar />
            </SidebarProvider>
            <div className="flex flex-col grow space-y-[1em]">
                <Header />
                {selectedPageId ? <Editor key={selectedPageId} docId={selectedPageId} /> : null}
            </div>
        </main>
    );
}

