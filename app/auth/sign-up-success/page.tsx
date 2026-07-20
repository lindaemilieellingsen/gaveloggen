"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"
import { GiftIcon } from "@/components/gift-icon"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"

export default function SignUpSuccessPage() {
  const { language } = useLanguage()

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
        <div className="flex flex-col gap-6">
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
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-[#F5EBD7] p-3">
                  <Mail className="h-6 w-6 text-[#C9A227]" />
                </div>
              </div>
              <CardTitle className="text-2xl text-[#5C4A1F]" style={{ fontFamily: "var(--font-display)" }}>
                {t("auth.checkEmail", language)}
              </CardTitle>
              <CardDescription className="text-sm text-[#8B6914]/80">
                {t("auth.confirmationSent", language)}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-[#8B6914]/80 mb-4">
                {t("auth.confirmationDescription", language)} {t("appName", language)}.
              </p>
              <Link
                href="/auth/login"
                className="text-sm text-[#6B5210] underline underline-offset-4 hover:text-[#5C4A1F] font-medium"
              >
                {t("auth.backToLogin", language)}
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
