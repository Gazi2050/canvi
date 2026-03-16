'use client'

import type { ReactNode } from 'react'
import { QueryProvider } from '@/lib/providers/QueryProvider'

type AppRootProviderProps = {
	children: ReactNode
}

export function AppRootProvider({ children }: AppRootProviderProps) {
	return <QueryProvider>{children}</QueryProvider>
}

