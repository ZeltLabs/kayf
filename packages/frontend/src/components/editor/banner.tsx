"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconPicker } from "@/components/ui/icon-picker";
import { BannerType, usePages } from "@/hooks/use-pages";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

export function Banner({ docId }: { docId: string }) {
    const { pages, renamePage, updateIcon, updateBanner } = usePages("fileTree");
    const page = pages[docId];
    const [editingTitle, setEditingTitle] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (page?.title) setTitle(page.title);
    }, [page?.title]);

    const handleTitleBlur = async () => {
        setEditingTitle(false);
        if (page && title !== page.title) {
            await renamePage(page.id, title);
        }
    };

    if (!page) return <Skeleton className="h-[48px] w-full rounded mb-4" />;

    return (
        <div className="flex flex-col w-full">
            <div className="relative w-full h-48 overflow-hidden bg-muted rounded group">
                {page.banner && (
                    <img
                        src={page.banner.url}
                        alt="Banner"
                        className="w-full h-full object-cover transition-transform"
                        draggable={false}
                    />
                )}
                <BannerDialog
                    banner={page.banner}
                    onApply={(b) => updateBanner(page.id, b)}
                />
            </div>

            <div className="flex flex-row grow-0 w-fit ml-[2em] mt-[-2em] items-center gap-3 bg-background/80 px-3 py-2 rounded shadow-md backdrop-blur">
                <IconPicker onApply={(icon) => updateIcon(page.id, icon)}>
                    {page.icon.startsWith("http") ? (
                        <img src={page.icon} alt="icon" className="w-10 h-10 object-contain rounded-sm" />
                    ) : (
                        <span className="text-3xl">{page.icon}</span>
                    )}
                </IconPicker>
                {editingTitle ? (
                    <Input
                        className="text-lg font-semibold px-2 py-1 w-full max-w-lg"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                        autoFocus
                    />
                ) : (
                    <h1
                        className={cn("text-lg font-semibold text-foreground cursor-text hover:underline decoration-muted")}
                        onClick={() => setEditingTitle(true)}
                    >
                        {page.title}
                    </h1>
                )}
                <Badge variant="secondary" className="text-xs">
                    {page.type.toUpperCase()}
                </Badge>
            </div>
        </div>
    );
}

function DraggableBanner({ banner, setBanner }: {
    banner: BannerType,
    setBanner: React.Dispatch<React.SetStateAction<BannerType | null>>,
}) {
    return (
        <div className="relative h-48 overflow-hidden rounded-md border">
            <img
                src={banner.url}
                alt="Preview"
                className="absolute w-full h-full object-cover transition-transform select-none"
                draggable={false}
            />
        </div>
    );
}

function BannerDialog({ banner, onApply }: {
    banner: BannerType | undefined;
    onApply: (b: BannerType | null) => void;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [customUrl, setCustomUrl] = useState("");
    const [tempBanner, setTempBanner] = useState<BannerType | null>(null);
    const [, setPage] = useState(1);
    const observerRef = useRef<HTMLDivElement>(null);
    const debouncedSearch = useDebounce(search, 500);

    const fetchImages = useCallback(async (pageNumber: number) => {
        const endpoint = (debouncedSearch.length) ? `search?query=${debouncedSearch}&` : 'curated?'
        setLoading(true);
        try {
            const res = await fetch(`https://api.pexels.com/v1/${endpoint}per_page=9&page=${pageNumber}`, {
                headers: { Authorization: process.env.NEXT_PUBLIC_PEXELS_KEY! },
            });
            const data = await res.json();
            if (data) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const urls = data.photos.map((p: any) => p.src.landscape);
                setImages((prev) => [...prev, ...urls]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        if (dialogOpen) setSearch("")
    }, [dialogOpen, setSearch])

    useEffect(() => {
        if (!dialogOpen) return;
        setImages([]);
        setPage(1);
        fetchImages(1);
    }, [dialogOpen, setSearch, setImages, fetchImages])

    useEffect(() => {
        setTempBanner(banner ? { ...banner } : null);
    }, [dialogOpen, setTempBanner, banner]);

    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading) {
                setPage((old) => {
                    const newVal = old + 1;
                    fetchImages(newVal);
                    return newVal;
                });
            }
        });
        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [fetchImages, loading]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
                >
                    <Pencil className="w-4 h-4 mr-1" /> Edit banner
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[75vw] min-h-[75vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Banner</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="library" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList>
                        <TabsTrigger value="library">Image Library</TabsTrigger>
                        <TabsTrigger value="link">From URL</TabsTrigger>
                    </TabsList>
                    <div className="flex-1 overflow-auto">
                        <TabsContent value="library" className="flex flex-col gap-4">
                            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Pexels" />
                            <div className="grid grid-cols-3 gap-2">
                                {images.map((url, i) => (
                                    <button
                                        key={`editor-header-preview-${i}-${url}`}
                                        onClick={() => setTempBanner({ url, zoom: 1, offsetX: 0, offsetY: 0 })}
                                        className={cn("rounded overflow-hidden hover:ring-2 ring-primary transition", tempBanner?.url === url && "ring-2 ring-primary")}
                                    >
                                        <img src={url} alt="Preview" className="w-full h-32 object-cover" />
                                    </button>
                                ))}
                                <div ref={observerRef} className="h-8" />
                            </div>
                            {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
                        </TabsContent>
                        <TabsContent value="link" className="flex flex-col gap-4">
                            <Input
                                value={customUrl}
                                onChange={(e) => {
                                    const url = e.target.value;
                                    setCustomUrl(url);
                                    setTempBanner({ url, zoom: 1, offsetX: 0, offsetY: 0 });
                                }}
                                placeholder="Paste image URL"
                            />
                        </TabsContent>
                    </div>
                    {tempBanner && (
                        <div className="border-t pt-4 flex flex-col gap-4">
                            <DraggableBanner banner={tempBanner} setBanner={setTempBanner} />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => {
                                    if (banner && banner.url === tempBanner.url && banner.zoom === tempBanner.zoom && banner.offsetX === tempBanner.offsetX && banner.offsetY === tempBanner.offsetY)
                                        onApply(null);
                                    setDialogOpen(false);
                                }}>Discard</Button>
                                <Button onClick={() => {
                                    if (tempBanner) onApply(tempBanner);
                                    setDialogOpen(false);
                                }}>Apply</Button>
                            </div>
                        </div>
                    )}
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

