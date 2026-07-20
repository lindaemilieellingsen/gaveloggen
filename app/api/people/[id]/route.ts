import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 })

  const { id } = await params
  await sql`DELETE FROM people WHERE id = ${id} AND user_id = ${session.userId}`
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const rows = await sql`
    UPDATE people SET
      name = COALESCE(${body.name ?? null}, name),
      relationship = COALESCE(${body.relationship ?? null}, relationship),
      sort_order = COALESCE(${body.sort_order ?? null}, sort_order)
    WHERE id = ${id} AND user_id = ${session.userId}
    RETURNING *
  `
  return NextResponse.json(rows[0])
}
