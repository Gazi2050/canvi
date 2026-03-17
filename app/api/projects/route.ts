import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'

const PUBLIC_ID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function generatePublicId(length: number = 12): string {
  let result = ''
  const max = PUBLIC_ID_CHARS.length
  for (let i = 0; i < length; i += 1) {
    const idx = Math.floor(Math.random() * max)
    result += PUBLIC_ID_CHARS[idx]!
  }
  return result
}

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
  const { userId } = await auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const user = await currentUser()
  const ownerEmail = user?.primaryEmailAddress?.emailAddress ?? undefined

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
  const publicId = generatePublicId()

  try {
    const [project] = await db
      .insert(projects)
      .values({
        publicId,
        ownerEmail,
        title,
        content,
        isPublic,
        members: [],
        createdAt: new Date().toISOString(),
      })
      .returning()

    return NextResponse.json({ id: project.publicId, title: project.title })
  } catch (err) {
    console.error('Failed to create project', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

