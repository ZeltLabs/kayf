"use client"

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface RenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultName: string
  onConfirm: (newName: string) => void
}

export function RenameDialog({ open, onOpenChange, defaultName, onConfirm }: RenameDialogProps) {
  const [value, setValue] = useState(defaultName)

  useEffect(() => {
    if (open) setValue(defaultName)
  }, [open, defaultName])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename page</DialogTitle>
        </DialogHeader>
        <Input value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onConfirm(value); onOpenChange(false) }}>Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
