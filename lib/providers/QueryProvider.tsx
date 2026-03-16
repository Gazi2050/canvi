'use client'

import { type ReactNode, useState } from 'react'
import {
	QueryClient,
	QueryClientProvider,
	HydrationBoundary,
	type DehydratedState,
} from '@tanstack/react-query'

type QueryProviderProps = {
	children: ReactNode
	state?: DehydratedState | null
}

export function QueryProvider({ children, state }: QueryProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60, // 1 minute
						refetchOnWindowFocus: false,
						retry: 1,
					},
					mutations: {
						retry: 1,
					},
				},
			}),
	)

	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary state={state}>{children}</HydrationBoundary>
		</QueryClientProvider>
	)
}

