'use client'

import Link from 'next/link'
import { CalendarArrowUp, CalendarPlus, Folder, Trash2 } from 'lucide-react'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import type { Project } from '@/lib/services/projects'

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const href = `/app/project/${project.publicId ?? project.id}`
  const title = project.title?.trim() || 'Untitled project'
  const createdAt =
    project.createdAt != null ? new Date(project.createdAt).toLocaleDateString() : undefined
  const updatedAt =
    project.updatedAt != null ? new Date(project.updatedAt).toLocaleDateString() : undefined

  let visibilityLabel: 'Public' | 'Private' | 'Shared'
  if (project.isPublic) {
    visibilityLabel = 'Public'
  } else if (project.members && project.members.length > 0) {
    visibilityLabel = 'Shared'
  } else {
    visibilityLabel = 'Private'
  }

  return (
    <Card className="border border-foreground/20 bg-background/60 hover:bg-background/80 transition-colors rounded-2xl">
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/10 text-foreground shrink-0">
          <Folder className="h-7 w-7" />
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={href}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
          >
            <CardTitle className="truncate text-base font-semibold text-foreground">
              {title}
            </CardTitle>
          </Link>
          <CardDescription className="mt-1 text-sm text-foreground/70 space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs">
              <CalendarPlus className="h-3.5 w-3.5" />
              <span>Created {createdAt ?? 'Unknown'}</span>
            </div>
            {updatedAt && (
              <div className="flex items-center gap-1.5 text-xs">
                <CalendarArrowUp className="h-3.5 w-3.5" />
                <span>Updated {updatedAt}</span>
              </div>
            )}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center rounded-full border border-foreground/20 px-3 py-1 text-xs font-medium text-foreground/80 bg-foreground/5">
            {visibilityLabel}
          </span>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-destructive/30 text-destructive/80 hover:bg-destructive/10 transition-colors"
            aria-label="Delete project"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Card>
  )
}

