import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 })
  }
  return NextResponse.json({ id: session.userId, email: session.email })
}
