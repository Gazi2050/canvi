import type { ProjectMember } from '@/lib/db/schema'

export type Project = {
  id: number
  ownerEmail: string
  title: string | null
  content: unknown
  isPublic: boolean
  members: ProjectMember[]
  createdAt: string
  updatedAt: string | null
}

export async function listProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects')
  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }
  return (await res.json()) as Project[]
}

export async function createProject(): Promise<{ id: number; title: string | null }> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })

  if (!res.ok) {
    throw new Error('Failed to create project')
  }

  return (await res.json()) as { id: number; title: string | null }
}

