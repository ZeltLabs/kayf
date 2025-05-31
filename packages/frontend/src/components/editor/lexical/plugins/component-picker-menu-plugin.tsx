"use client"

import { JSX, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useBasicTypeaheadTriggerMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin"
import { TextNode } from "lexical"
import { createPortal } from "react-dom"

import { useEditorModal } from "@/components/editor/lexical/hooks/use-modal"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import { ComponentPickerOption } from "./picker/component-picker-option"

const LexicalTypeaheadMenuPlugin = dynamic(
    () => import("./default/lexical-typeahead-menu-plugin"),
    { ssr: false }
)

function TypeaheadMenu({
    anchorRef,
    selectedIndex,
    selectOptionAndCleanUp,
    setHighlightedIndex,
    options,
    queryString,
}: {
    anchorRef: { current: HTMLElement | null }
    selectedIndex: number | null
    selectOptionAndCleanUp: (option: ComponentPickerOption) => void
    setHighlightedIndex: (index: number) => void
    options: ComponentPickerOption[],
    queryString: string,
    setQueryString: (s: string) => void
}) {

    const [query, setQuery] = useState(queryString);

    useEffect(() => {
        setQuery(queryString)
    }, [queryString])

    if (!anchorRef.current || options.length === 0) return null

    return createPortal(
        <div className="fixed shadow-md z-50">
            <Command
                className="w-lg rounded-lg border shadow-lg bg-background/95 backdrop-blur-sm"
                onKeyDown={(e) => {
                    if (e.key === "ArrowUp") {
                        e.preventDefault()
                        setHighlightedIndex(
                            selectedIndex !== null
                                ? (selectedIndex - 1 + options.length) % options.length
                                : options.length - 1
                        )
                    } else if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setHighlightedIndex(
                            selectedIndex !== null
                                ? (selectedIndex + 1) % options.length
                                : 0
                        )
                    }
                }}
            >
                <CommandInput
                    placeholder="Type a command or search..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandGroup>
                        {options.map((option, index) => (
                            <CommandItem
                                key={option.key}
                                value={option.title}
                                onSelect={() => selectOptionAndCleanUp(option)}
                                className={`flex items-center gap-2 ${selectedIndex === index ? "bg-accent" : "!bg-transparent"
                                    }`}
                            >
                                {option.icon}
                                {option.title}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
            </Command>
        </div>,
        anchorRef.current
    )
}

export function ComponentPickerMenuPlugin({
    baseOptions = [],
    dynamicOptionsFn,
}: {
    baseOptions?: Array<ComponentPickerOption>
    dynamicOptionsFn?: (args: { queryString: string }) => Array<ComponentPickerOption>
}): JSX.Element {
    const [editor] = useLexicalComposerContext()
    const [modal, showModal] = useEditorModal()
    const [queryString, setQueryString] = useState("")

    const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", { minLength: 0 })

    const options = dynamicOptionsFn
        ? [...dynamicOptionsFn({ queryString }), ...baseOptions]
        : baseOptions

    function handleSelect(
        selectedOption: ComponentPickerOption,
        nodeToRemove: TextNode | null,
        closeMenu: () => void,
        matchingString: string
    ) {
        editor.update(() => {
            nodeToRemove?.remove()
            selectedOption.onSelect(matchingString, editor, showModal)
            closeMenu()
        })
    }

    return (
        <>
            {modal}
            {/* @ts-ignore */}
            <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
                onQueryChange={setQueryString}
                onSelectOption={handleSelect}
                triggerFn={checkForTriggerMatch}
                options={options}
                menuRenderFn={(anchorRef, props) => (
                    <TypeaheadMenu
                        anchorRef={anchorRef}
                        queryString={queryString}
                        {...props}
                    />
                )}
            />
        </>
    )
}
