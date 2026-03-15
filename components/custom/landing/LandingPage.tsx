'use client'

import { Show, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
					<SignInButton mode="redirect" forceRedirectUrl="/sign-in">
						<Button type="button" variant="outline">
							Sign in
						</Button>
					</SignInButton>
					<SignUpButton mode="redirect" forceRedirectUrl="/sign-up">
						<Button type="button">Sign up</Button>
					</SignUpButton>
				</Show>
				<Show when="signed-in">
					<Button asChild>
						<Link href="/app">Go to app</Link>
					</Button>
				</Show>
			</div>
		</main>
	)
}
