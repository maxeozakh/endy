import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { DEFAULT_METRICS, DEFAULT_TAGS } from '../constants'

export interface UserMetric {
  name: string
  color: string
  id: string
}
interface UserEntitiesStore {
  tags: string[]
  metrics: UserMetric[]
  addUserTags: (tags: string[]) => void
  addUserMetrics: (metrics: UserMetric[]) => void
}

export const useUserEntitiesState = create<UserEntitiesStore>()(
  devtools(
    persist(
      (set) => ({
        tags: [...DEFAULT_TAGS],
        metrics: [...DEFAULT_METRICS],
        addUserTags: (tags) => set((state) => ({ tags: [...state.tags, ...tags] })),
        addUserMetrics: (metrics) => set((state) => ({ metrics: [...state.metrics, ...metrics] })),
      }),
      {
        name: 'user-entities-store',
      }
    )
  )
)

export const getUserTags = () => useUserEntitiesState((state) => state.tags)
export const getUserMetrics = () => useUserEntitiesState((state) => state.metrics)