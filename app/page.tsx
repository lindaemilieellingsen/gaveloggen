"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { GiftIcon } from "@/components/gift-icon"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"

export default function HomePage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 animate-slow-zoom"
        style={{
          backgroundImage: `url('/gift-background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector className="text-[#FDF8F0] hover:bg-white/20" />
      </div>

      {/* Content */}
      <main className="relative z-10 container px-4 py-32 md:py-48">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <GiftIcon size="xl" className="drop-shadow-2xl" />
            </div>
          </div>
          <h1
            className="text-5xl md:text-7xl font-semibold tracking-wide text-balance text-[#FDF8F0] drop-shadow-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("appName", language)}
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-[#FDF8F0]/90 drop-shadow tracking-wide font-light">
            {t("landing.tagline", language)}
          </p>
          <div className="mt-12 flex justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-[#8B6914] to-[#A67C00] hover:from-[#6B5210] hover:to-[#8B6914] text-[#FDF8F0] shadow-lg w-full sm:w-auto text-base tracking-wide"
              >
                {t("landing.getStarted", language)}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
