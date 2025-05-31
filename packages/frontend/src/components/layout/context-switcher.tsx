"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Grid, Search, User, Settings } from "lucide-react";

import { useAtom } from 'jotai'
import { tracerOpenAtom } from "@/atoms/tracer";
import { LogoImageOnly } from "../logo";

interface NavIndicatorProps {
    route: string;
}

export const NavIndicator = ({ route }: NavIndicatorProps) => {
    const pathname = usePathname();
    const isActive = pathname === route;

    return (
        <span
            className={`absolute -left-1 w-1 h-6 rounded transition-all duration-500
${isActive ? "!opacity-100 scale-y-100 bg-primary" : "opacity-0 scale-y-50 bg-transparent"} group-hover:opacity-50 group-hover:scale-y-100 group-hover:bg-primary`}
        />
    );
};

export default function ContextSwitcher() {
    const [, setVisible] = useAtom<boolean>(tracerOpenAtom);
    const handleSearch = () => {
        setVisible(true)
    };

    const iconStyle = "!h-[22px] !w-[22px]"

    const topItems = [
        {
            key: "docs",
            route: "/",
            icon: <FileText className={iconStyle} />,
        },
        {
            key: "workflows",
            route: "/workflows",
            icon: <Grid className={iconStyle} />,
        },
        {
            key: "search",
            icon: <Search className={iconStyle} />,
            onClick: handleSearch,
        },
    ];

    const bottomItems = [
        {
            key: "user",
            route: "/user",
            icon: <User className={iconStyle} />,
        },
        {
            key: "preferences",
            route: "/preferences",
            icon: <Settings className={iconStyle} />,
        },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderItem = (item: any) => {
        if (item.onClick) {
            return (
                <div key={item.key} className="relative flex items-center">
                    <Button variant="ghost" onClick={item.onClick}>
                        {item.icon}
                    </Button>
                </div>
            );
        }
        return (
            <Link key={`context-switcher-item-${item.key}`} href={item.route}>
                <div className="relative flex items-center group">
                    <NavIndicator route={item.route} />
                    <Button variant="ghost">
                        {item.icon}
                    </Button>
                </div>
            </Link>
        );
    };

    return (
        <div className="h-screen left-0 top-0 bottom-0 p-[1em] pr-0 z-50">
            <div className="bg-secondary border rounded shadow-md flex flex-col justify-between h-full p-1">
                <div className="flex flex-col items-center space-y-4">
                    <Link className="p-2 bg-primary rounded" href={'/'}>
                        <LogoImageOnly className="text-secondary" />
                    </Link>

                    {topItems.map(renderItem)}
                </div>

                <div className="flex flex-col items-center space-y-4">
                    {bottomItems.map(renderItem)}
                </div>
            </div>
        </div>
    );
}
