import { MetricValue, getLastRecordedMetric } from '../../shared/stores/records'
import { isDateIsToday, isDateIsYesterday } from '../../shared/utils'

export const useMetricStat = (metricName: string) => {
  const lastRecordedMetric = getLastRecordedMetric(metricName)
  if (!lastRecordedMetric) {
    return {
      metricValue: 0 as MetricValue,
      dateLabel: 'No data',
    }
  }

  const { metrics, date } = lastRecordedMetric
  const lastEditLabel = getLastEditLabel(date)
  const metricValue = metrics[metricName]

  return {
    metricValue,
    dateLabel: lastEditLabel,
  }
}

export const getLastEditLabel = (date: string): string => {
  let dateLabel

  if (isDateIsToday(date)) {
    dateLabel = 'Today'
  } else if (isDateIsYesterday(date)) {
    dateLabel = 'Yesterday'
  } else {
    dateLabel = new Date(date).toLocaleDateString()
  }

  return dateLabel
}
