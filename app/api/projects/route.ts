import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'

export async function GET() {
  try {
    const allProjects = await db.select().from(projects)
    return NextResponse.json(allProjects)
  } catch (err) {
    console.error('Failed to fetch projects', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const claims = sessionClaims as Record<string, unknown> | null
  const ownerEmail =
    typeof claims?.email === 'string'
      ? (claims.email as string)
      : typeof claims?.email_address === 'string'
        ? (claims.email_address as string)
        : undefined

  if (!ownerEmail) {
    return new NextResponse('Missing owner email', { status: 400 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const asRecord = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}

  const rawTitle = typeof asRecord.title === 'string' ? asRecord.title : ''
  const title = rawTitle.trim() || 'Untitled project'

  const isPublic = asRecord.isPublic === true
  const content = asRecord.content ?? {}

  try {
    const [project] = await db
      .insert(projects)
      .values({
        ownerEmail,
        title,
        content,
        isPublic,
        members: [],
        createdAt: new Date().toISOString(),
      })
      .returning()

    return NextResponse.json({ id: project.id, title: project.title })
  } catch (err) {
    console.error('Failed to create project', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

