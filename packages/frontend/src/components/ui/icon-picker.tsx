import React, { useState, useEffect } from "react"
import { Popover } from "@radix-ui/react-popover"
import { PopoverContent, PopoverTrigger } from "./popover"
import {
    EmojiPicker,
    EmojiPickerContent,
    EmojiPickerFooter,
    EmojiPickerSearch,
} from "./emoji-picker"
import { Input } from "./input"
import { Button } from "./button"
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "./tabs"

export interface IconPickerProps {
    onApply: (icon: string) => Promise<void> | void
    children: React.ReactNode
}

export function IconPicker({ onApply, children }: IconPickerProps) {
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState<"emoji" | "image">("emoji")
    const [emoji, setEmoji] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (!open) {
            setEmoji("")
            setImageUrl("")
            setTab("emoji")
            setError("")
        }
    }, [open])

    const isValidImageUrl = (url: string) => {
        return /^https?:\/\/.+\.(png|jpe?g|svg|webp|gif)$/i.test(url.trim())
    }

    const selectedIcon = tab === "emoji" ? emoji : imageUrl.trim()
    const isValid = tab === "emoji"
        ? Boolean(emoji)
        : Boolean(imageUrl.trim()) && isValidImageUrl(imageUrl)

    useEffect(() => {
        if (tab === "image") {
            if (!imageUrl.trim()) {
                setError("")
            } else if (!isValidImageUrl(imageUrl)) {
                setError("Please enter a valid image URL (png, jpg, svg...)")
            } else {
                setError("")
            }
        } else {
            setError("")
        }
    }, [imageUrl, tab])

    const handleApply = () => {
        if (isValid) {
            onApply(selectedIcon)
            setOpen(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                className="z-1000 w-72 max-h-[90vh] overflow-y-auto p-4 space-y-4"
                side="right"
                align="start"
            >
                <Tabs value={tab} onValueChange={(v) => setTab(v as "emoji" | "image")}>
                    <TabsList className="w-full mb-1">
                        <TabsTrigger value="emoji" className="flex-1">Emoji</TabsTrigger>
                        <TabsTrigger value="image" className="flex-1">Image</TabsTrigger>
                    </TabsList>

                    <TabsContent value="emoji">
                        <EmojiPicker
                            className="h-[200px]"
                            onEmojiSelect={({ emoji }) => setEmoji(emoji)}
                        >
                            <EmojiPickerSearch />
                            <EmojiPickerContent />
                            <EmojiPickerFooter />
                        </EmojiPicker>
                    </TabsContent>

                    <TabsContent value="image" className="space-y-2">
                        <Input
                            placeholder="https://example.com/icon.png"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter the URL of an image (PNG, JPG, SVG, etc).
                        </p>
                        {error && (
                            <p className="text-xs text-red-500 mt-1">{error}</p>
                        )}
                    </TabsContent>
                </Tabs>

                {isValid && (
                    <div className="text-center w-full">
                        <div className="text-sm items-center text-muted-foreground mb-1">Preview:</div>
                        {tab === "emoji" ? (
                            <div className="text-3xl">{emoji}</div>
                        ) : (
                            <div className="flex justify-center">
                                <img
                                    src={imageUrl}
                                    alt="preview"
                                    className="h-12 max-w-[80%] rounded border object-contain"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-2 justify-end pt-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1"
                        onClick={handleApply}
                        disabled={!isValid}
                    >
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
