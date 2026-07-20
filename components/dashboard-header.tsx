"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { GiftIcon } from "@/components/gift-icon"
import { LanguageSelector } from "@/components/language-selector"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"

interface DashboardHeaderProps {
  email?: string
}

export function DashboardHeader({ email }: DashboardHeaderProps) {
  const router = useRouter()
  const { language } = useLanguage()

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/auth/login")
  }

  return (
    <header className="border-b border-[#C9A227]/30 bg-gradient-to-r from-[#FDF8F0]/95 to-[#F5EBD7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FDF8F0]/80 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <GiftIcon size="sm" className="drop-shadow" />
          <span className="text-xl font-bold text-[#5C4A1F]" style={{ fontFamily: "var(--font-display)" }}>
            {t("appName", language)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector className="text-[#5C4A1F] hover:bg-[#F5EBD7]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#F5EBD7]">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#A67C00] to-[#8B6914] flex items-center justify-center shadow-sm">
                  <User className="h-4 w-4 text-[#FDF8F0]" />
                </div>
                <span className="sr-only">{t("auth.userMenu", language)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#FDF8F0]/95 border-[#C9A227]/50">
              {email && (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-[#5C4A1F]">{email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-[#C9A227]/30" />
                </>
              )}
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-[#8B6914] focus:text-[#5C4A1F] focus:bg-[#F5EBD7]"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("auth.logout", language)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
