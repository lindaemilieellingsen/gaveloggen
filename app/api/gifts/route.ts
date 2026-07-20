import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 })

  const gifts = await sql`
    SELECT
      g.*,
      json_build_object('id', p.id, 'name', p.name, 'relationship', p.relationship, 'user_id', p.user_id, 'created_at', p.created_at, 'sort_order', p.sort_order) AS person
    FROM gifts g
    JOIN people p ON g.person_id = p.id
    WHERE g.user_id = ${session.userId}
    ORDER BY g.created_at DESC
  `
  return NextResponse.json(gifts)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 })

  const body = await request.json()

  const rows = await sql`
    INSERT INTO gifts (user_id, person_id, title, description, occasion, occasion_custom, year, is_idea, given_date)
    VALUES (
      ${session.userId},
      ${body.person_id},
      ${body.title},
      ${body.description ?? null},
      ${body.occasion},
      ${body.occasion_custom ?? null},
      ${body.year},
      ${body.is_idea ?? false},
      ${body.given_date ?? null}
    )
    RETURNING *
  `

  const gift = rows[0]

  const withPerson = await sql`
    SELECT
      g.*,
      json_build_object('id', p.id, 'name', p.name, 'relationship', p.relationship, 'user_id', p.user_id, 'created_at', p.created_at, 'sort_order', p.sort_order) AS person
    FROM gifts g
    JOIN people p ON g.person_id = p.id
    WHERE g.id = ${gift.id}
  `

  return NextResponse.json(withPerson[0])
}
