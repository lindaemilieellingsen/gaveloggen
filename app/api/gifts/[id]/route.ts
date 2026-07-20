import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 })

  const { id } = await params
  await sql`DELETE FROM gifts WHERE id = ${id} AND user_id = ${session.userId}`
  return NextResponse.json({ ok: true })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  await sql`
    UPDATE gifts SET
      person_id = COALESCE(${body.person_id ?? null}, person_id),
      title = COALESCE(${body.title ?? null}, title),
      description = ${body.description ?? null},
      occasion = COALESCE(${body.occasion ?? null}, occasion),
      occasion_custom = ${body.occasion_custom ?? null},
      year = COALESCE(${body.year ?? null}, year),
      is_idea = COALESCE(${body.is_idea ?? null}, is_idea),
      given_date = ${body.given_date ?? null},
      updated_at = NOW()
    WHERE id = ${id} AND user_id = ${session.userId}
  `

  const withPerson = await sql`
    SELECT
      g.*,
      json_build_object('id', p.id, 'name', p.name, 'relationship', p.relationship, 'user_id', p.user_id, 'created_at', p.created_at, 'sort_order', p.sort_order) AS person
    FROM gifts g
    JOIN people p ON g.person_id = p.id
    WHERE g.id = ${id}
  `

  return NextResponse.json(withPerson[0])
}
