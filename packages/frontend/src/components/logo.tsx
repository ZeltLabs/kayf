import { cn } from "@/lib/utils";
import KayfSvg from "@/../public/logo.svg"; // Will be treated as React component with SVGR
import ZeltSvg from "@/../public/zeltlabs.svg"; // Will be treated as React component with SVGR

export default function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <KayfSvg className="h-5 w-auto text-foreground" />
            <span className="font-bold text-xl text-foreground text-base">Kayf</span>
        </div>
    );
};


export function LogoImageOnly({ className }: { className?: string }) {
    return (
        <KayfSvg className={cn("h-5 w-auto text-foreground", className)} />
    );
};

export function ZeltLogo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <ZeltSvg className="h-5 w-auto text-foreground" />
            <span className="font-bold text-xl text-foreground text-base">ZeltLabs</span>
        </div>
    );
};


export function ZeltLogoImageOnly({ className }: { className?: string }) {
    return (
        <ZeltSvg className={cn("h-5 w-auto text-foreground", className)} />
    );
};
