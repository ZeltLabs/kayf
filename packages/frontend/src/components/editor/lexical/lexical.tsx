"use client"

import { Editor } from "@/components/editor/lexical/editor-component"

export default function LexicalEditor({ docId }: { docId: string }) {
    return <Editor docId={docId} userId={`user-${(Math.random() * 100) | 0}`} username="Leopold" />
}

