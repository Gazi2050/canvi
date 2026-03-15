'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ProjectsList() {
	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-xl font-semibold tracking-tight text-foreground">
					Your canvases
				</h1>
				<Button asChild>
					<Link href="/app">Create New Canvas</Link>
				</Button>
			</div>
			<div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] border-dashed min-h-[280px] flex flex-col items-center justify-center p-8 text-center">
				<p className="text-foreground/60 text-sm max-w-sm">
					No canvases yet. Create one to get started.
				</p>
				<Button variant="outline" className="mt-4" asChild>
					<Link href="/app">Create New Canvas</Link>
				</Button>
			</div>
		</div>
	)
}
