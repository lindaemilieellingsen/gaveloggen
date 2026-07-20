import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

// PUT /api/people/sort
// body: [{ id, sort_order }]
export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 })

  const updates: { id: string; sort_order: number }[] = await request.json()

  for (const { id, sort_order } of updates) {
    await sql`
      UPDATE people SET sort_order = ${sort_order}
      WHERE id = ${id} AND user_id = ${session.userId}
    `
  }

  return NextResponse.json({ ok: true })
}
