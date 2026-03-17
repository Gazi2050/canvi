'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProjectCard } from '@/components/custom/dashboard/ProjectCard'
import { useCreateProjectMutation, useProjectsQuery } from '@/lib/hooks/useProjects'

export function ProjectsList() {
	const router = useRouter()

	const { data: projects, isLoading } = useProjectsQuery()
	const createProjectMutation = useCreateProjectMutation()

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [title, setTitle] = useState('')

	const openDialog = () => {
		setTitle('')
		setIsDialogOpen(true)
	}

	const closeDialog = () => {
		if (createProjectMutation.isPending) return
		setIsDialogOpen(false)
	}

	const handleConfirmCreate = async () => {
		if (!title.trim()) return
		try {
			const result = await createProjectMutation.mutateAsync({ title: title.trim() })

			setIsDialogOpen(false)
			setTitle('')

			if (result?.id) {
				router.push(`/app/project/${result.id}`)
			}
		} catch {
			// ignore for now; could add toast later
		}
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-xl font-semibold tracking-tight text-foreground">
					Your projects
				</h1>
				<Button onClick={openDialog} disabled={createProjectMutation.isPending}>
					Create New Project
				</Button>
			</div>

			{/* Simple inline modal for project title */}
			{isDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
					<div className="w-full max-w-sm rounded-xl border border-foreground/10 bg-background p-6 shadow-lg">
						<h2 className="text-lg font-semibold mb-2 text-foreground">New project</h2>
						<p className="text-xs text-foreground/60 mb-4">
							Give your project a short, clear name. You can change it later.
						</p>
						<div className="space-y-2 mb-4">
							<label className="text-xs font-medium text-foreground/70">
								Title
							</label>
							<Input
								autoFocus
								placeholder="E.g. Team planning board"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault()
										void handleConfirmCreate()
									}
								}}
							/>
						</div>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={closeDialog}
								disabled={createProjectMutation.isPending}
							>
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={handleConfirmCreate}
								disabled={createProjectMutation.isPending || !title.trim()}
							>
								{createProjectMutation.isPending ? 'Creating…' : 'Create'}
							</Button>
						</div>
					</div>
				</div>
			)}

			<div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] min-h-[280px] flex flex-col gap-4 p-6">
				{isLoading ? (
					<p className="text-foreground/60 text-sm text-center">Loading projects…</p>
				) : projects && projects.length > 0 ? (
					<div className="flex w-full flex-col gap-3">
						{projects.map((project) => (
							<ProjectCard key={project.publicId ?? project.id} project={project} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center text-center py-8">
						<p className="text-foreground/60 text-sm max-w-sm">
							No projects yet. Create one to get started.
						</p>
						<Button
							variant="outline"
							className="mt-4"
							onClick={openDialog}
							disabled={createProjectMutation.isPending}
						>
							Create New Project
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
