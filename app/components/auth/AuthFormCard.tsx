'use client'

import { ReactNode } from 'react'

type AuthFormCardProps = {
	siteName?: string
	title: string
	children: ReactNode
	className?: string
}

export function AuthFormCard({ siteName, title, children, className = '' }: AuthFormCardProps) {
	return (
		<div
			className={`w-full max-w-[420px] rounded-2xl border border-foreground/10 bg-background/80 p-8 shadow-[0_1px_2px_rgba(0,0,0,.04)] ${className}`}
		>
			<header className="mb-8 text-center">
				{siteName && (
					<p className="text-[11px] font-semibold tracking-[0.25em] text-foreground/40 uppercase">
						{siteName}
					</p>
				)}
				<h2 className="mt-3 text-2xl font-medium tracking-tight text-foreground">
					{title}
				</h2>
			</header>
			{children}
		</div>
	)
}
