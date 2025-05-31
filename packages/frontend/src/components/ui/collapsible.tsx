"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

function Collapsible({
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
    return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
    return (
        <CollapsiblePrimitive.CollapsibleTrigger
            data-slot="collapsible-trigger"
            {...props}
        />
    )
}

function CollapsibleContent({
    className,
    children,
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
    return (
        <CollapsiblePrimitive.CollapsibleContent
            data-slot="collapsible-content"
            className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
            {...props}
        >
            <div className={className}>{children}</div>
        </CollapsiblePrimitive.CollapsibleContent>
    )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
