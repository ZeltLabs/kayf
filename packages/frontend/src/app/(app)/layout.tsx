import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import ContextSwitcher from "@/components/layout/context-switcher";
import Tracer from "@/components/tracer/modal";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Command } from "@/components/actions/command";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Kayf.app - Collaborative workspace",
    description: "Kayf is a hyper-extendable editor with scalable enterprise search and automation platform, fully tailored to your requirements. Powerful, private, and tracking-free.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    forcedTheme="dark"
                    disableTransitionOnChange
                >
                    <div className="flex flex-row w-screen h-screen">
                        <ContextSwitcher />
                        <Tracer />
                        <Command />

                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
