<script setup>
import { computed } from 'vue'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

import { Pie } from 'vue-chartjs'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

const props = defineProps({
  green: Number,
  yellow: Number,
  red: Number
})

const chartData = computed(() => ({
  labels: [
    'ดี',
    'ปานกลาง',
    'แย่'
  ],
  datasets: [
    {
      data: [
        props.green,
        props.yellow,
        props.red
      ],
      backgroundColor: [
        '#4CAF50',
        '#FFC107',
        '#F44336'
      ]
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <div class="chart-wrapper">
    <Pie
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<style scoped>
.chart-wrapper {
  height: 260px;
}
</style>