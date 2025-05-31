import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ZeltLogo } from "@/components/logo"

export default function LoginPage() {
    return (
        <section className="relative flex min-h-screen items-center justify-center px-4 py-16 md:py-32 bg-background dark:bg-background overflow-hidden">
            {/* Animated Background Gradient */}

            <div
                className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-secondary to-muted dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 bg-400 animated-gradient blur-2xl opacity-50"
                aria-hidden
            />


            <form className="bg-card z-1 w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pb-6">
                    <div>
                        <Link href="/" aria-label="Go home">
                            <ZeltLogo />
                        </Link>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">Sign in to Kayf</h1>
                        <p className="text-sm text-muted-foreground">Welcome back! Please enter details.</p>
                    </div>

                    <div className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">
                                Email
                            </Label>
                            <Input type="email" required name="email" id="email" />
                        </div>

                        <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="pwd" className="text-sm">
                                    Password
                                </Label>
                                <Button asChild variant="link" size="sm">
                                    <Link href="zeltlabs.com/reset-password" className="text-sm">
                                        Forgot password?
                                    </Link>
                                </Button>
                            </div>
                            <Input
                                type="password"
                                required
                                name="pwd"
                                id="pwd"
                                className="input sz-md variant-mixed"
                            />
                        </div>

                        <Button className="w-full">Sign in</Button>
                    </div>
                </div>

                <div className="bg-muted rounded-b-[calc(var(--radius)+.125rem)] border-t p-3">
                    <p className="text-center text-sm">
                        Don’t have an account?
                        <Button asChild variant="link" className="px-2">
                            <Link href="zeltlabs.com/register">Create one</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}

