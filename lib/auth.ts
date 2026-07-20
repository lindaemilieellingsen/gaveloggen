import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

export interface SessionData {
  userId: string
  email: string
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "gaveloggen-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 dager
  },
}

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  return session
}
