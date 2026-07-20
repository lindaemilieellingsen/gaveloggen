"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { GiftTracker } from "@/components/gift-tracker"

interface User {
  id: string
  email: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/me")
      if (!res.ok) {
        router.push("/auth/login")
        return
      }
      const data = await res.json()
      setUser(data)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
      style={{
        backgroundImage: `url('/gift-background.jpg')`,
        backgroundColor: "#F5EBD7",
      }}
    >
      <div className="min-h-screen bg-black/10">
        <DashboardHeader email={user.email} />
        <main className="container px-4 py-8 max-w-4xl mx-auto">
          <GiftTracker userId={user.id} />
        </main>
      </div>
    </div>
  )
}
