"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { GiftIcon } from "@/components/gift-icon"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { language } = useLanguage()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const emailStr = String(email).trim()
    const passwordStr = String(password)

    if (passwordStr !== repeatPassword) {
      setError(t("auth.passwordMismatch", language))
      setIsLoading(false)
      return
    }

    if (passwordStr.length < 6) {
      setError(t("auth.passwordTooShort", language))
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailStr, password: passwordStr }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t("auth.errorOccurred", language))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden">
      <div
        className="absolute inset-0 animate-slow-zoom"
        style={{
          backgroundImage: "url('/gift-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector className="text-[#FDF8F0] hover:bg-white/20" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
            <GiftIcon size="md" className="drop-shadow-lg" />
            <span
              className="text-2xl sm:text-3xl font-bold text-[#FDF8F0] drop-shadow-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("appName", language)}
            </span>
          </div>
          <Card className="border-[#A67C00]/40 bg-gradient-to-br from-[#FDF8F0]/95 to-[#F5EBD7]/95 backdrop-blur-md shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl text-[#5C4A1F]" style={{ fontFamily: "var(--font-display)" }}>
                {t("auth.register", language)}
              </CardTitle>
              <CardDescription className="text-sm text-[#8B6914]/80">
                {t("auth.registerDescription", language)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="grid gap-1.5 sm:gap-2">
                    <Label htmlFor="email" className="text-sm text-[#5C4A1F]">
                      {t("auth.email", language)}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("auth.emailPlaceholder", language)}
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-9 sm:h-10 border-[#C9A227]/50 bg-white/80 focus:border-[#A67C00] focus:ring-[#A67C00]"
                    />
                  </div>
                  <div className="grid gap-1.5 sm:gap-2">
                    <Label htmlFor="password" className="text-sm text-[#5C4A1F]">
                      {t("auth.password", language)}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-9 sm:h-10 border-[#C9A227]/50 bg-white/80 focus:border-[#A67C00] focus:ring-[#A67C00]"
                    />
                  </div>
                  <div className="grid gap-1.5 sm:gap-2">
                    <Label htmlFor="repeat-password" className="text-sm text-[#5C4A1F]">
                      {t("auth.repeatPassword", language)}
                    </Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="h-9 sm:h-10 border-[#C9A227]/50 bg-white/80 focus:border-[#A67C00] focus:ring-[#A67C00]"
                    />
                  </div>
                  {error && <p className="text-sm text-[#8B6914]">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full h-9 sm:h-10 mt-1 bg-gradient-to-r from-[#8B6914] to-[#A67C00] hover:from-[#6B5210] hover:to-[#8B6914] text-[#FDF8F0] shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? t("auth.registering", language) : t("auth.register", language)}
                  </Button>
                </div>
                <div className="mt-4 text-center text-xs sm:text-sm text-[#8B6914]/80">
                  {t("auth.hasAccount", language)}{" "}
                  <Link
                    href="/auth/login"
                    className="text-[#6B5210] underline underline-offset-4 hover:text-[#5C4A1F] font-medium"
                  >
                    {t("auth.login", language)}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
