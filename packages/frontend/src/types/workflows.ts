export type FieldType =
    | "text"
    | "number"
    | "textarea"
    | "password"
    | "email"
    | "url"
    | "tel"
    | "date"
    | "month"
    | "week"
    | "time"
    | "checkbox"
    | "radio"
    | "range"
    | "color";

export interface NodeField {
    label: string;
    field: string;
    type: FieldType;
}

export interface NodeData {
    id: string;
    type: string; // must match a NodeCategory.type
    display_name: string;
    description: string;
    input: NodeField[];
    output: never[];
}

export interface NodeCategory {
    type: string;
    label: string;
}

export interface WorkflowDefinition {
    categories: NodeCategory[];
    nodes: NodeData[];
}

