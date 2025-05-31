import { atomWithStorage } from "jotai/utils"

export const selectedPageIdAtom = atomWithStorage<string | null>('selectedFile', null)
