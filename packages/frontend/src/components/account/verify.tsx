"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ZeltLogo } from "@/components/logo"
import axios from "axios"
import Link from "next/link"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your account...")

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/verify`, {
          params: { token },
        })
        setStatus("success")
        setMessage(res.data.msg || "Your account has been successfully verified.")
      } catch (err: any) {
        setStatus("error")
        setMessage(
          err.response?.data?.detail || "Verification failed. This link may be invalid or expired."
        )
      }
    }

    if (token) verify()
    else {
      setStatus("error")
      setMessage("No token provided.")
    }
  }, [token])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
      <Link href="/" aria-label="Go home">
        <ZeltLogo className="mb-6" />
      </Link>

      <div className="max-w-md w-full bg-card border rounded-lg p-6 shadow-md">
        <h1 className="text-xl font-semibold mb-2">Account Verification</h1>
        <p className={`text-sm ${status === "error" ? "text-red-500" : "text-muted-foreground"}`}>
          {message}
        </p>

        {status === "success" && (
          <Button className="mt-6 w-full" onClick={() => router.push("/")}>
            Go to Login
          </Button>
        )}

        {status === "error" && (
          <Button className="mt-6 w-full" variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        )}
      </div>
    </section>
  )
}
