"use client";

import { useState, useEffect, useCallback } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { v4 as uuidv4 } from "uuid";

/**
 * Represents the type of a page node in the tree.
 */
export type PageType = "document" | "canvas" | "file";

export interface BannerType {
    url: string;
    zoom: number;
    offsetY: number;
    offsetX: number;
};


/**
 * Represents a single page (node) in the file tree hierarchy.
 * Mirrors the content stored in the shared Y.Map.
 */
export interface PageNode {
    id: string;
    title: string;
    parentId?: string;
    childrenIds: string[];
    type: PageType;
    icon: string;
    banner?: BannerType;
}

/**
 * Returns the default emoji icon based on the page type.
 */
function defaultIconForType(type: PageType): string {
    switch (type) {
        case "document":
            return "📝";
        case "canvas":
            return "🖼️";
        case "file":
            return "📄";
    }
}

/**
 * Internal structure that links a shared Yjs document (Y.Doc)
 * with a Hocuspocus WebSocket provider.
 */
type DocEntry = {
    ydoc: Y.Doc;
    provider: HocuspocusProvider;
};

/**
 * Global document registry: prevents multiple providers for the same doc.
 */
const docs = new Map<string, DocEntry>();

/**
 * Custom React hook to connect to a collaborative, real-time page tree.
 *
 * The Y.Doc stores a single top-level map called "fileTree":
 *
 *   ydoc.getMap("fileTree") ➝ Y.Map<PageId, Y.Map<unknown>>
 *
 * Each value in this map is another Y.Map<unknown> representing a single page.
 *
 * Each Page Y.Map contains:
 * - `"title"`: string          ➝ Name of the page
 * - `"parentId"`: string|null  ➝ ID of parent node, or null if root
 * - `"children"`: Y.Array<string> ➝ Array of child node IDs
 * - `"type"`: "note" | "whiteboard" | "document"
 * - `"icon"`: string           ➝ Emoji or icon
 * - `"banner"`: { url: string, zoom: number, offsetY: number } ➝ Optional banner
 *
 * All updates to this structure are automatically synced across users.
 *
 * @param docName The shared document name (room identifier). Default: "fileTree"
 * @returns All pages and functions to modify them
 */
export function usePages(docName: string = "fileTree") {
    const [entry, setEntry] = useState<DocEntry | undefined>(undefined);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Only create one provider per doc name
        if (!docs.has(docName)) {
            const ydoc = new Y.Doc();

            const wsUrl =
                process.env.NEXT_PUBLIC_HOCUSPOCUS_WS_URL || "ws://localhost:1234";

            const provider = new HocuspocusProvider({
                url: wsUrl,
                name: docName,
                document: ydoc,
            });

            docs.set(docName, { ydoc, provider });
        }

        setEntry(docs.get(docName));
    }, [docName]);

    const ydoc = entry?.ydoc;
    const provider = entry?.provider;

    /**
     * The shared Y.Map holding the entire file tree.
     * Each key is a page UUID, each value is a Y.Map<unknown> containing metadata.
     */
    const [treeMap, setTreeMap] = useState<Y.Map<Y.Map<unknown>> | null>(null);

    useEffect(() => {
        if (!ydoc) return;
        const m = ydoc.getMap<Y.Map<unknown>>("fileTree");
        setTreeMap(m);
    }, [ydoc]);

    const [pages, setPages] = useState<Record<string, PageNode>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!treeMap) return;

        /**
         * Syncs the local `pages` state from the shared `treeMap`.
         */
        const update = () => {
            const out: Record<string, PageNode> = {};
            treeMap.forEach((nodeMap, id) => {
                out[id] = {
                    id,
                    title: nodeMap.get("title") as string,
                    parentId: nodeMap.get("parentId") as string | undefined,
                    childrenIds: (nodeMap.get("children") as Y.Array<string>).toArray(),
                    type: nodeMap.get("type") as PageType,
                    icon: nodeMap.get("icon") as string,
                    banner: nodeMap.get("banner") as BannerType | undefined,
                };
            });
            setPages(out);
            setIsLoading(false);
        };

        update();
        treeMap.observeDeep(update);
        return () => void treeMap.unobserveDeep(update);
    }, [treeMap]);

    /**
     * Creates a new page and adds it to the shared treeMap.
     * Also appends its ID to the parent's `children` array if applicable.
     *
     * @returns The newly created page ID
     */
    const createPage = useCallback(
        async (
            parentId: string | null,
            title: string,
            type: PageType,
            icon?: string
        ): Promise<string> => {
            if (!treeMap || !ydoc) return "";

            const id = uuidv4();
            const nodeMap = new Y.Map<unknown>();

            nodeMap.set("title", title);
            nodeMap.set("parentId", parentId);
            nodeMap.set("children", new Y.Array<string>());
            nodeMap.set("type", type);
            nodeMap.set("icon", icon ?? defaultIconForType(type));
            nodeMap.set("banner", null);

            ydoc.transact(() => {
                treeMap.set(id, nodeMap);

                if (parentId) {
                    const parent = treeMap.get(parentId)!;
                    (parent.get("children") as Y.Array<string>).push([id]);
                }
            });

            return id;
        },
        [treeMap, ydoc]
    );

    /**
     * Updates the `title` of the given page node.
     */
    const renamePage = useCallback(
        async (id: string, newTitle: string) => {
            if (!treeMap || !ydoc) return;
            const node = treeMap.get(id);
            if (!node) return;
            ydoc.transact(() => node.set("title", newTitle));
        },
        [treeMap, ydoc]
    );

    /**
     * Updates the `icon` (emoji/symbol) of the given page.
     */
    const updateIcon = useCallback(
        async (id: string, newIcon: string) => {
            if (!treeMap || !ydoc) return;
            const node = treeMap.get(id);
            if (!node) return;
            ydoc.transact(() => node.set("icon", newIcon));
        },
        [treeMap, ydoc]
    );

    /**
     * Sets or replaces the banner object for the page.
     * Includes `url`, `zoom`, and `offsetY`.
     */
    const updateBanner = useCallback(
        async (id: string, newBanner: BannerType | null) => {
            if (!treeMap || !ydoc) return;
            const node = treeMap.get(id);
            if (!node) return;
            ydoc.transact(() => node.set("banner", newBanner));
        },
        [treeMap, ydoc]
    );

    /**
     * Deletes a node and all its descendants recursively from the treeMap.
     * Also removes the node ID from its parent's children array.
     */
    const deletePage = useCallback(
        async (id: string) => {
            if (!treeMap || !ydoc) return;

            // Recursive DFS delete
            const drop = (nid: string) => {
                const n = treeMap.get(nid);
                (n?.get("children") as Y.Array<string>)?.toArray().forEach(drop);
                ydoc.transact(() => treeMap.delete(nid));
            };

            const node = treeMap.get(id);
            const parentId = node?.get("parentId") as string | null;

            if (parentId) {
                const parent = treeMap.get(parentId)!;
                ydoc.transact(() => {
                    const arr = parent.get("children") as Y.Array<string>;
                    const rest = arr.toArray().filter((c) => c !== id);
                    arr.delete(0, arr.length);
                    arr.insert(0, rest);
                });
            }

            drop(id);
        },
        [treeMap, ydoc]
    );

    return {
        pages,         // React-local shadow copy of the tree for rendering
        isLoading,     // Indicates initial sync state
        createPage,    // Add new page node
        renamePage,    // Change title
        updateIcon,    // Change icon
        updateBanner,  // Set banner object { url, zoom, offsetY }
        deletePage,    // Recursive delete
        provider,      // Hocuspocus WebSocket provider (for awareness, etc.)
        ydoc,          // Shared document object
    };
}
