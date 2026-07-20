import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "E-post og passord er påkrevd" }, { status: 400 })
    }

    const users = await sql`
      SELECT id, email, password_hash FROM users WHERE email = ${email.toLowerCase().trim()}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Feil e-post eller passord" }, { status: 401 })
    }

    const user = users[0]
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Feil e-post eller passord" }, { status: 401 })
    }

    const session = await getSession()
    session.userId = user.id
    session.email = user.email
    await session.save()

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Noe gikk galt" }, { status: 500 })
  }
}
