'use client'

import { Show, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'

export function LandingPage() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold tracking-tight text-foreground">
					Freespace
				</h1>
				<p className="text-lg text-foreground/80 max-w-md">
					Collaborative whiteboard and canvas. Sketch, plan, and create together.
				</p>
			</div>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Show when="signed-out">
					<SignInButton mode="redirect" redirectUrl="/sign-in">
						<button
							type="button"
							className="px-5 py-2.5 text-sm font-medium rounded-md border border-foreground/20 text-foreground hover:bg-foreground/5"
						>
							Sign in
						</button>
					</SignInButton>
					<SignUpButton mode="redirect" redirectUrl="/sign-up">
						<button
							type="button"
							className="px-5 py-2.5 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90"
						>
							Sign up
						</button>
					</SignUpButton>
				</Show>
				<Show when="signed-in">
					<Link
						href="/app"
						className="px-5 py-2.5 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90"
					>
						Go to app
					</Link>
				</Show>
			</div>
		</main>
	)
}
