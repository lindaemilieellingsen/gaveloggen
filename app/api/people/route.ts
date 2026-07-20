import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 })

  const people = await sql`
    SELECT * FROM people WHERE user_id = ${session.userId} ORDER BY sort_order ASC, created_at ASC
  `
  return NextResponse.json(people)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 })

  const body = await request.json()

  // Støtter enten ett objekt eller en array
  const items = Array.isArray(body) ? body : [body]

  const result = []
  for (const item of items) {
    const rows = await sql`
      INSERT INTO people (user_id, name, relationship, sort_order)
      VALUES (${session.userId}, ${item.name}, ${item.relationship ?? null}, ${item.sort_order ?? 0})
      RETURNING *
    `
    result.push(rows[0])
  }

  return NextResponse.json(Array.isArray(body) ? result : result[0])
}
