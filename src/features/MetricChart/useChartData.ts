import { getChartStrucutre } from './utils'
import { Period } from '../../shared/interfaces'
import { getSelectedPeriod } from '../../shared/stores/metricData'
import { getRecordsByPeriodAndMetric } from '../../shared/stores/records'
import { getUserMetricByName } from '../../shared/stores/userEntities'

const verticalTickFunctions = {
  [Period.WEEK]: (t: number) => Math.round(t),
  [Period.MONTH]: (t: number) => Math.round(t),
}

const horizontalTickFunctions = {
  [Period.WEEK]: (t: string) => t.slice(0, 3),
  [Period.MONTH]: (t: string) => new Date(t).getDate(),
}

const cornerRadiusStyles = {
  [Period.WEEK]: { top: 5 },
  [Period.MONTH]: { top: 2 },
}

export const useChartData = (metricName: string) => {
  const selectedPeriod = getSelectedPeriod()
  const metricData = getUserMetricByName(metricName)
  const data = getChartDataByPeriod(selectedPeriod, metricName)

  const barWidth = selectedPeriod === Period.WEEK ? 35 : 10
  const { color } = metricData
  const barStyles = {
    data: { fill: color, width: barWidth },
    labels: {
      fill: 'white',
      stroke: 'white',
      color: 'white',
    },
  }

  const horizontalTickFormatFn = horizontalTickFunctions[selectedPeriod]
  const verticalTickFormatFn = verticalTickFunctions[selectedPeriod]
  const cornerRadiusStyle = cornerRadiusStyles[selectedPeriod]

  return {
    data,
    verticalTickFormatFn,
    horizontalTickFormatFn,
    barStyles,
    cornerRadiusStyle,
  }
}

export const getChartDataByPeriod = (period: Period, metricName: string) => {
  const records = getRecordsByPeriodAndMetric(period, metricName)

  const dataStructure = getChartStrucutre(period)

  const chartData = dataStructure.map((day) => {
    const dayRecords = records.filter((record) => {
      return (
        new Date(record.date).toDateString() === new Date(day).toDateString() &&
        record.metrics[metricName]
      )
    })

    let value: number | null = null

    if (dayRecords.length !== 0) {
      value =
        dayRecords.reduce((acc, record) => {
          return acc + record.metrics[metricName] ?? 0
        }, 0) / dayRecords.length
    }

    return {
      day,
      value,
    }
  })

  return chartData
}
