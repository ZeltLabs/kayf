"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ZeltLogo } from "@/components/logo"
import { useState } from "react"
import axios from "axios"

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("")
    const [surname, setSurname] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        try {
            await axios.post("http://localhost:8000/register", {
                full_name: `${firstName} ${surname}`,
                username,
                email,
                password,
            })
            setSuccess("Check your inbox for the verification email.")
        } catch (err: any) {
            const msg = err.response?.data?.detail || "Registration failed"
            setError(msg)
        }
    }

    const loginWithProvider = (provider: "google" | "github") => {
        window.open(
            `http://localhost:8000/auth/provider/${provider}?redirect_uri=popup`,
            "_blank",
            "width=500,height=600"
        )
    }

    return (
        <section className="relative flex min-h-screen items-center justify-center px-4 py-16 md:py-32 bg-background dark:bg-background overflow-hidden">
            <div
                className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-secondary to-muted dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 bg-400 animated-gradient blur-2xl opacity-50"
                aria-hidden
            />

            <form onSubmit={handleRegister} className="bg-card z-1 w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pb-6">
                    <div>
                        <Link href="/" aria-label="Go home">
                            <ZeltLogo />
                        </Link>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">Create your Kayf account</h1>
                        <p className="text-sm text-muted-foreground">Start your journey. It's quick and free.</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => loginWithProvider("google")}
                            className="flex items-center justify-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="0.98em"
                                height="1em"
                                viewBox="0 0 256 262">
                                <path
                                    fill="#4285f4"
                                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                <path
                                    fill="#34a853"
                                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                <path
                                    fill="#fbbc05"
                                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                                <path
                                    fill="#eb4335"
                                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                            </svg>
                            <span>Google</span>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => loginWithProvider("github")}
                            className="flex items-center justify-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 256 256">
                                <path
                                    fill="#f1511b"
                                    d="M121.666 121.666H0V0h121.666z"></path>
                                <path
                                    fill="#80cc28"
                                    d="M256 121.666H134.335V0H256z"></path>
                                <path
                                    fill="#00adef"
                                    d="M121.663 256.002H0V134.336h121.663z"></path>
                                <path
                                    fill="#fbbc09"
                                    d="M256 256.002H134.335V134.336H256z"></path>
                            </svg>
                            <span>GitHub</span>
                        </Button>
                    </div>

                    <div className="space-y-6 mt-6">
                        {/* Full name row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="first" className="block text-sm">First name</Label>
                                <Input
                                    type="text"
                                    required
                                    id="first"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="surname" className="block text-sm">Surname</Label>
                                <Input
                                    type="text"
                                    required
                                    id="surname"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="block text-sm">Username</Label>
                            <Input
                                type="text"
                                required
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">Email</Label>
                            <Input
                                type="email"
                                required
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="pwd" className="block text-sm">Password</Label>
                            <Input
                                type="password"
                                required
                                id="pwd"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button className="w-full" type="submit">Create account</Button>
                        {error && <p className="text-sm text-red-500 my-2 text-center">{error}</p>}
                        {success && <p className="text-sm text-green-600 my-2 text-center">{success}</p>}
                    </div>
                </div>

                <div className="bg-muted rounded-b-[calc(var(--radius)+.125rem)] border-t p-3">
                    <p className="text-center text-sm">
                        Already have an account?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/login">Sign in</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}
