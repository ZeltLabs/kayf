import { useAtom } from "jotai";
import { commandLatestItemsAtom } from "@/atoms/command";
import { CommandAction } from "@/types/command";

const maxCommandItems = 5

export function useInsertCommandItem() {
    const [, setItems] = useAtom(commandLatestItemsAtom);

    return (item: CommandAction) => {
        setItems((prev) => {
            const withoutDupes = prev.filter((i) => i.title !== item.title);
            const updated = [item, ...withoutDupes];

            if (updated.length > maxCommandItems) {
                updated.pop(); // remove last
            }

            return updated;
        });
    };
}

export function useClearCommandItems() {
    const [, setItems] = useAtom(commandLatestItemsAtom);
    return () => setItems([]);
}
