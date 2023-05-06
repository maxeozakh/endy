export type navigationProps = {
  navigate: (screen: string, params?: unknown) => void
  goBack: () => void
  reset: (index: number, routeNames: string[]) => void
  push: (screen: string) => void
  getCurrentRoute: () => { name: string }
}

export type RouteProps = { params: { metricName: string }; key: string; name: string }

export type RootStackParamList = {
  [Routes.METRIC_DATA]: {
    metricName: string
  }
  [Routes.DASHBOARD]: undefined
  [Routes.SETTINGS]: undefined
  [Routes.TRACK_TAGS]: undefined
  [Routes.TRACK_METRICS]: undefined
  [Routes.ADD_NEW_TAGS]: undefined
  [Routes.MANAGE_METRICS]: undefined
}

export enum Routes {
  INITIAL = 'Dashboard',
  DASHBOARD = 'Dashboard',
  SETTINGS = 'Settings',
  TRACK_TAGS = 'Track tags',
  TRACK_METRICS = 'Track metrics',
  METRIC_DATA = 'Metric data',
  ADD_NEW_TAGS = 'Add new tags',
  MANAGE_METRICS = 'Manage metrics',
}
