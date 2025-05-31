import * as React from "react"
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useCollaborationContext } from "@lexical/react/LexicalCollaborationContext"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"
import { mergeRegister } from "@lexical/utils"
import {
    $getNodeByKey,
    $getSelection,
    $isNodeSelection,
    BaseSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    NodeKey,
} from "lexical"

import type {
    Option,
    Options,
    PollNode,
} from "@/components/editor/lexical/nodes/poll-node"
import {
    $isPollNode,
    createPollOption,
} from "@/components/editor/lexical/nodes/poll-node"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

function getTotalVotes(options: Options): number {
    return options.reduce((totalVotes, next) => {
        return totalVotes + next.votes.length
    }, 0)
}

function PollOptionComponent({
    option,
    index,
    options,
    totalVotes,
    withPollNode,
}: {
    index: number
    option: Option
    options: Options
    totalVotes: number
    withPollNode: (
        cb: (pollNode: PollNode) => void,
        onSelect?: () => void
    ) => void
}): JSX.Element {
    const { clientID } = useCollaborationContext()
    const votesArray = option.votes
    const checkedIndex = votesArray.indexOf(clientID)
    const checked = checkedIndex !== -1
    const votes = votesArray.length
    const text = option.text

    return (
        <div className="mb-2.5 flex flex-row items-center space-x-2 w-full">
            <Checkbox
                className="h-[22px] w-[22px]"
                onCheckedChange={() => {
                    withPollNode((node) => {
                        node.toggleVote(option, clientID)
                    })
                }}
                checked={checked}
            />
            <div className="relative flex flex-1 cursor-pointer overflow-hidden rounded-md border">
                <div
                    className="transition-width bg-accent absolute top-0 left-0 z-0 h-full duration-1000 ease-in-out"
                    style={{ width: `${votes === 0 ? 0 : (votes / totalVotes) * 100}%` }}
                />
                <span className="text-primary absolute top-1 right-4 text-xs z-1">
                    {votes > 0 && (votes === 1 ? "1 vote" : `${votes} votes`)}
                </span>
                <Input
                    type="text"
                    className="bg-transparent z-1"
                    value={text}
                    onChange={(e) => {
                        const target = e.target
                        const value = target.value
                        const selectionStart = target.selectionStart
                        const selectionEnd = target.selectionEnd
                        withPollNode(
                            (node) => {
                                node.setOptionText(option, value)
                            },
                            () => {
                                target.selectionStart = selectionStart
                                target.selectionEnd = selectionEnd
                            }
                        )
                    }}
                    placeholder={`Option ${index + 1}`}
                />
            </div>
            <Button
                disabled={options.length < 3}
                variant={'outline'}
                aria-label="Remove"
                onClick={() => {
                    withPollNode((node) => {
                        node.deleteOption(option)
                    })
                }}
            ><X />
            </Button>
        </div>
    )
}

export default function PollComponent({
    question,
    options,
    nodeKey,
}: {
    nodeKey: NodeKey
    options: Options
    question: string
}): JSX.Element {
    const [editor] = useLexicalComposerContext()
    const totalVotes = useMemo(() => getTotalVotes(options), [options])
    const [isSelected, setSelected, clearSelection] =
        useLexicalNodeSelection(nodeKey)
    const [selection, setSelection] = useState<BaseSelection | null>(null)
    const ref = useRef(null)

    const $onDelete = useCallback(
        (payload: KeyboardEvent) => {
            const deleteSelection = $getSelection()
            if (isSelected && $isNodeSelection(deleteSelection)) {
                const event: KeyboardEvent = payload
                event.preventDefault()
                editor.update(() => {
                    deleteSelection.getNodes().forEach((node) => {
                        if ($isPollNode(node)) {
                            node.remove()
                        }
                    })
                })
            }
            return false
        },
        [editor, isSelected]
    )

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                setSelection(editorState.read(() => $getSelection()))
            }),
            editor.registerCommand<MouseEvent>(
                CLICK_COMMAND,
                (payload) => {
                    const event = payload

                    if (event.target === ref.current) {
                        if (!event.shiftKey) {
                            clearSelection()
                        }
                        setSelected(!isSelected)
                        return true
                    }

                    return false
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_DELETE_COMMAND,
                $onDelete,
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_BACKSPACE_COMMAND,
                $onDelete,
                COMMAND_PRIORITY_LOW
            )
        )
    }, [clearSelection, editor, isSelected, nodeKey, $onDelete, setSelected])

    const withPollNode = (
        cb: (node: PollNode) => void,
        onUpdate?: () => void
    ): void => {
        editor.update(
            () => {
                const node = $getNodeByKey(nodeKey)
                if ($isPollNode(node)) {
                    cb(node)
                }
            },
            { onUpdate }
        )
    }

    const addOption = () => {
        withPollNode((node) => {
            node.addOption(createPollOption())
        })
    }

    const isFocused = $isNodeSelection(selection) && isSelected

    return (
        <div
            className={`w-full flex grow bg-background cursor-pointer rounded-lg border select-none ${isFocused ? "outline-primary outline outline-1" : ""
                }`}
            ref={ref}
        >
            <div className="m-4 cursor-default w-full">
                <h2 className="m-0 mb-4 text-center text-lg font-bold underline">
                    {question}
                </h2>
                {options.map((option, index) => {
                    const key = option.uid
                    return (
                        <PollOptionComponent
                            key={key}
                            withPollNode={withPollNode}
                            option={option}
                            index={index}
                            options={options}
                            totalVotes={totalVotes}
                        />
                    )
                })}
                <div className="flex justify-center">
                    <Button onClick={addOption} size="sm">
                        Add Option
                    </Button>
                </div>
            </div>
        </div>
    )
}
