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

    if (password.length < 6) {
      return NextResponse.json({ error: "Passord må være minst 6 tegn" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existing = await sql`SELECT id FROM users WHERE email = ${normalizedEmail}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "Denne e-postadressen er allerede i bruk" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const users = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${normalizedEmail}, ${passwordHash})
      RETURNING id, email
    `

    const user = users[0]
    const session = await getSession()
    session.userId = user.id
    session.email = user.email
    await session.save()

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Noe gikk galt" }, { status: 500 })
  }
}
