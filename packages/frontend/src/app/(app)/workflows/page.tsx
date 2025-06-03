"use client"

import Header from "@/components/layout/header";
import EditorSidebar from "@/components/layout/sidebar/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import NodeSelector from "@/components/workflows/node-selector";
import WorkflowsProvider from "@/components/workflows/workflows"
import { WorkflowDefinition } from "@/types/workflows";

const workflowDefinition: WorkflowDefinition = {
    categories: [
        { type: "communication", label: "Communication" },
        { type: "formatting", label: "Formatting" },
        { type: "integrations", label: "Integrations" },
        { type: "llm", label: "AI & Language Models" },
        { type: "tools", label: "Tools" }
    ],
    nodes: [
        {
            id: "send_email",
            type: "communication",
            display_name: "Send Email",
            description: "Send an email using SMTP or a provider.",
            input: [
                { label: "From", field: "from", type: "email" },
                { label: "To", field: "to", type: "email" },
                { label: "Subject", field: "subject", type: "text" },
                { label: "Content", field: "content", type: "textarea" }
            ],
            output: []
        },
        {
            id: "slack_msg",
            type: "communication",
            display_name: "Slack Message",
            description: "Sends a message to a Slack channel.",
            input: [
                { label: "OAuth Token", field: "token", type: "password" },
                { label: "Channel ID", field: "channel_id", type: "text" },
                { label: "Message", field: "message", type: "textarea" }
            ],
            output: []
        },
        {
            id: "telegram_msg",
            type: "communication",
            display_name: "Telegram Message",
            description: "Sends a message via Telegram Bot API.",
            input: [
                { label: "Bot Token", field: "token", type: "password" },
                { label: "Chat ID", field: "chat_id", type: "text" },
                { label: "Message", field: "message", type: "textarea" }
            ],
            output: []
        },
        {
            id: "json_parse",
            type: "formatting",
            display_name: "JSON Parse",
            description: "Parses a string into a JSON object.",
            input: [
                { label: "JSON String", field: "json_string", type: "textarea" }
            ],
            output: []
        },
        {
            id: "github_issue",
            type: "integrations",
            display_name: "GitHub Create Issue",
            description: "Creates a new issue in a GitHub repository.",
            input: [
                { label: "Access Token", field: "token", type: "password" },
                { label: "Repository", field: "repo", type: "text" },
                { label: "Title", field: "title", type: "text" },
                { label: "Body", field: "body", type: "textarea" }
            ],
            output: []
        },
        {
            id: "google_sheets_append",
            type: "integrations",
            display_name: "Google Sheets Append Row",
            description: "Adds a new row to a Google Sheet.",
            input: [
                { label: "Access Token", field: "token", type: "password" },
                { label: "Spreadsheet ID", field: "spreadsheet_id", type: "text" },
                { label: "Range", field: "range", type: "text" },
                { label: "Values (CSV)", field: "values", type: "textarea" }
            ],
            output: []
        },
        {
            id: "openai",
            type: "llm",
            display_name: "OpenAI Completion",
            description: "Generates a response using OpenAI's GPT model.",
            input: [
                { label: "API Token", field: "api_token", type: "password" },
                { label: "Prompt", field: "prompt", type: "textarea" }
            ],
            output: []
        },
        {
            id: "delay",
            type: "tools",
            display_name: "Delay",
            description: "Pauses workflow execution for a set time.",
            input: [
                { label: "Milliseconds", field: "delay_ms", type: "number" }
            ],
            output: []
        },
        {
            id: "set_data",
            type: "tools",
            display_name: "Set Data",
            description: "Set key-value pairs for later use.",
            input: [
                { label: "Key", field: "key", type: "text" },
                { label: "Value", field: "value", type: "text" }
            ],
            output: []
        }
    ]
};

export default function Workflows() {
    return (
        <main className="flex flex-row grow p-4 overflow-hidden space-x-4">
            <SidebarProvider className="min-h-0 w-fit p-0 flex h-full">
                <EditorSidebar />
            </SidebarProvider>
            <div className="flex flex-col grow space-y-[1em]">
                <Header />
                <WorkflowsProvider docId="random" nodeDefinitions={workflowDefinition.nodes} />
            </div>
            <SidebarProvider className="min-h-0 w-fit p-0 flex h-full">
                <NodeSelector categories={workflowDefinition.categories} nodes={workflowDefinition.nodes} />
            </SidebarProvider>
        </main>
    );
}
