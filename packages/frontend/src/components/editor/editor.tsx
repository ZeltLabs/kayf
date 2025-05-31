import { Banner } from "./banner";
import LexicalEditor from "./lexical/lexical";

export default function Editor({ docId }: { docId: string }) {
    return (
        <div className="flex h-full w-full bg-secondary border rounded shadow-md flex-col overflow-hidden p-2">
            <div className="h-full w-full rounded-t bg-background overflow-auto">
                <Banner docId={docId} />
                <LexicalEditor docId={docId} />
            </div>
            <div className="items-center justify-between rounded-b bg-background border-t px-2">
                <div id="kayf-editor-footer" />
            </div>
        </div>
    );
}
