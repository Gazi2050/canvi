'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCreateProjectMutation, useProjectsQuery } from '@/lib/hooks/useProjects'

export function ProjectsList() {
	const router = useRouter()

	const { data: projects, isLoading } = useProjectsQuery()
	const createProjectMutation = useCreateProjectMutation()

	const handleCreateProject = async () => {
		try {
			const result = await createProjectMutation.mutateAsync()

			if (result?.id !== undefined && result?.id !== null) {
				router.push(`/app/projects/${result.id}`)
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
				<Button onClick={handleCreateProject} disabled={createProjectMutation.isPending}>
					{createProjectMutation.isPending ? 'Creating…' : 'Create New Project'}
				</Button>
			</div>
			<div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] border-dashed min-h-[280px] flex flex-col items-center justify-center p-8 text-center">
				{isLoading ? (
					<p className="text-foreground/60 text-sm">Loading projects…</p>
				) : projects && projects.length > 0 ? (
					<ul className="space-y-2 w-full max-w-md text-left">
						{projects.map((project) => (
							<li
								key={project.id}
								className="flex items-center justify-between rounded-lg border border-foreground/10 bg-background/40 px-3 py-2 text-sm"
							>
								<span className="truncate">
									{project.title || `Project #${project.id}`}
								</span>
							</li>
						))}
					</ul>
				) : (
					<>
						<p className="text-foreground/60 text-sm max-w-sm">
							No projects yet. Create one to get started.
						</p>
						<Button
							variant="outline"
							className="mt-4"
							onClick={handleCreateProject}
							disabled={createProjectMutation.isPending}
						>
							{createProjectMutation.isPending ? 'Creating…' : 'Create New Project'}
						</Button>
					</>
				)}
			</div>
		</div>
	)
}
