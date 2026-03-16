'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProject, listProjects, type Project } from '@/lib/services/projects'

const projectsQueryKey = ['projects'] as const

export function useProjectsQuery() {
  return useQuery<Project[]>({
    queryKey: projectsQueryKey,
    queryFn: listProjects,
  })
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: projectsQueryKey })
    },
  })
}

