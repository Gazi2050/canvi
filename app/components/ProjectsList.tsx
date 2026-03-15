'use client'

import Link from 'next/link'

export function ProjectsList() {
	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-xl font-semibold tracking-tight text-foreground">
					Your canvases
				</h1>
				<Link
					href="/app"
					className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
				>
					Create New Canvas
				</Link>
			</div>
			<div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] border-dashed min-h-[280px] flex flex-col items-center justify-center p-8 text-center">
				<p className="text-foreground/60 text-sm max-w-sm">
					No canvases yet. Create one to get started.
				</p>
				<Link
					href="/app"
					className="mt-4 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border border-foreground/15 text-foreground hover:bg-foreground/5 transition-colors"
				>
					Create New Canvas
				</Link>
			</div>
		</div>
	)
}
