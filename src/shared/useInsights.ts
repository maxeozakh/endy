import { Period } from './interfaces'
import { getSelectedPeriod } from './stores/metricData'
import {
  getLastWeekRecordsByMetric,
  getRecordsByPeriodAndMetric,
  getRecordsWithMetric,
} from './stores/records'
import { getActiveUserTags } from './stores/userEntities'

export const useInsights = () => {
  const selectedPeriod = getSelectedPeriod()
  let pastDays = null

  switch (selectedPeriod) {
    case Period.WEEK:
      pastDays = 6
      break
    case Period.MONTH:
      pastDays = 29
      break
  }

  const getCornerDatesByPeriod = () => {
    const today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      23,
      59,
      59
    )

    const past = new Date(today.getFullYear(), today.getMonth(), today.getDate() - pastDays)

    return [past, today]
  }

  const getCorrelationsByMetric = (metricName: string) => {
    const recordsByPeriod = getRecordsByPeriodAndMetric(selectedPeriod, metricName)
    const activeUserTagNames = getActiveUserTags().map((tag) => tag.name)
    // period, metricName =>
    // all correlations between given metric and tags by the period

    if (!recordsByPeriod.length) {
      return []
    }

    const correlations = activeUserTagNames.map((tag) => {
      let metricTotalValue = 0
      let metricWithTagTotalValue = 0
      let recordsWithTagCount = 0

      recordsByPeriod.forEach((record) => {
        if (!record.metrics[metricName]) {
          console.error(
            'Metric not found in record and it cant be, because selector by metricName used appear',
            metricName,
            record
          )
          return
        }

        metricTotalValue += record.metrics[metricName]

        // tag can be not presented in record, in case if user track only their metrics
        if (record.tags?.includes(tag)) {
          recordsWithTagCount += 1
          metricWithTagTotalValue += record.metrics[metricName]
        }
      })

      const metricAvg = metricTotalValue / recordsByPeriod.length
      const metricTagAvg = metricWithTagTotalValue / recordsWithTagCount

      // correlation cannot be if tag presented only in < X% of marks
      const tagPercentagesPresentedIn = (recordsWithTagCount * 100) / recordsByPeriod.length
      // TODO: it should be dynamic based on records count
      const MINIMUM_PERCENTAGE_OF_TAGS_FOR_CORRELATION = 10
      const isMinimupTagPresented =
        tagPercentagesPresentedIn >= MINIMUM_PERCENTAGE_OF_TAGS_FOR_CORRELATION

      // if tag is not present with metric we consider it as zero correlation
      const correlation =
        recordsWithTagCount && isMinimupTagPresented ? 100 - (metricTagAvg * 100) / metricAvg : 0

      // prevent NaN cases when correlation is 0
      if (Math.abs(correlation) < 0.1 || !recordsWithTagCount) {
        return { tag, correlation: null }
      }

      return {
        tag,
        correlation,
      }
    })

    const correlationsWithoutZero = correlations.filter((correlation) => correlation.correlation)

    return correlationsWithoutZero
  }

  const getMinAndMaxCorrelationsByMetric = (metricName: string) => {
    const correlations = getCorrelationsByMetric(metricName)

    if (!correlations.length) {
      return []
    }

    const sortedCorrelations = correlations.sort((a, b) => a.correlation - b.correlation)

    const minCorrelation = sortedCorrelations[0]
    const maxCorrelation = sortedCorrelations[sortedCorrelations.length - 1]

    return [minCorrelation, maxCorrelation]
  }

  const getAverageMetricValue = (metricName: string) => {
    const recordsByPeriod =
      selectedPeriod === Period.WEEK
        ? getLastWeekRecordsByMetric(metricName)
        : getRecordsWithMetric(metricName)

    if (!recordsByPeriod.length) {
      return 0
    }

    const metricTotalValue = recordsByPeriod.reduce((acc, record) => {
      return acc + record.metrics[metricName]
    }, 0)

    const metricAvg = Math.round(metricTotalValue / recordsByPeriod.length)

    return metricAvg
  }

  return {
    getCorrelationsByMetric,
    getAverageMetricValue,
    getCornerDatesByPeriod,
    getMinAndMaxCorrelationsByMetric,
  }
}
