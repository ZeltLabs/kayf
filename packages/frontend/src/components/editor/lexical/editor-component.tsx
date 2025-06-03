"use client"

import {
    InitialConfigType,
    LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin"
import { HocuspocusProvider } from "@hocuspocus/provider"
import * as Y from "yjs"
import { useCallback } from "react"

import { FloatingLinkContext } from "@/components/editor/lexical/context/floating-link-context"
import { SharedAutocompleteContext } from "@/components/editor/lexical/context/shared-autocomplete-context"
import { editorTheme } from "@/components/editor/lexical/themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"
import { nodes } from "./nodes"
import { Plugins } from "./plugins"
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical"

const $initialEditorState = () => {
    const root = $getRoot()
    const paragraph = $createParagraphNode()
    paragraph.append($createTextNode(""))
    root.append(paragraph)
}

const editorConfig: InitialConfigType = {
    namespace: "Editor",
    theme: editorTheme,
    nodes,
    editorState: null,
    onError: (error: Error) => {
        console.error(error)
    },
}

function getDocFromMap(id: string, map: Map<string, Y.Doc>): Y.Doc {
    if (!map.has(id)) {
        map.set(id, new Y.Doc())
    }
    return map.get(id)!
}

export function Editor({
    docId,
    userId,
    username,
    color = "#ffcc00",
}: {
    docId: string
    userId: string
    username: string
    color?: string
}) {
    const providerFactory = useCallback(
        (id: string, yjsDocMap: Map<string, Y.Doc>) => {
            const doc = getDocFromMap(id, yjsDocMap)

            const provider = new HocuspocusProvider({
                url: "ws://localhost:1234",
                name: id, // use `id`, not `docId` from outer scope
                document: doc,
            })

            provider.awareness?.setLocalStateField("user", {
                name: username,
                color,
            })

            return provider
        },
        [username, color]
    )

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <TooltipProvider>
                <SharedAutocompleteContext>
                    <FloatingLinkContext>
                        <Plugins />
                        <CollaborationPlugin
                            id={docId}
                            providerFactory={providerFactory}
                            shouldBootstrap={true}
                            userId={userId}
                            name={username}
                            color={color}
                            initialEditorState={$initialEditorState}
                        />
                    </FloatingLinkContext>
                </SharedAutocompleteContext>
            </TooltipProvider>
        </LexicalComposer>
    )
}
