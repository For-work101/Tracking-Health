<template>
  <div class="container">

    <button
      class="back-btn"
      @click="router.back()"
    >
      ← กลับ
    </button>

    <h2>
      {{ title }}
    </h2>

    <div class="summary-card">

  <div class="chart-wrapper">

  <Bar
    :data="chartData"
    :options="chartOptions"
  />

  <div class="limit-line">
    ⚠ เส้นเป้าหมาย
    2000 mg/วัน
  </div>

</div>

  <div class="summary-info">
    <div>
      🟢 {{ greenPercent }}%
    </div>

    <div>
      🟡 {{ yellowPercent }}%
    </div>

    <div>
      🔴 {{ redPercent }}%
    </div>

    <!-- <div class="sodium">
      🧂 {{ sodiumTotal }} mg
    </div> -->
  </div>

</div>

    <div
      v-for="item in paginatedHistory"
      :key="item.id"
      class="history-card"
    >
      <img
        :src="item.foods?.image_url"
        class="food-image"
      >

      <div class="food-info">

        <h4>
          {{ item.foods?.food_name }}
        </h4>

        <p>
          {{ item.foods.sodium || 0 }} mg
        </p>

        <p>
          {{ levelText(item.food_level) }}
        </p>

        <small>
          {{ formatDate(item.eaten_at) }}
        </small>

      </div>
    </div>

    <div
      v-if="totalPages > 1"
      class="pagination"
    >

      <button
        @click="currentPage--"
        :disabled="
          currentPage === 1
        "
      >
        ◀ ก่อนหน้า
      </button>

      <span>
        {{ currentPage }}
        /
        {{ totalPages }}
      </span>

      <button
        @click="currentPage++"
        :disabled="
          currentPage === totalPages
        "
      >
        ถัดไป ▶
      </button>

    </div>

  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import annotationPlugin from 'chartjs-plugin-annotation'

import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

import {
  Bar
}
from 'vue-chartjs'



Chart.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  annotationPlugin
)



import {
  useRoute,
  useRouter
} from 'vue-router'

import { supabase }
from '@/lib/supabase'

const route = useRoute()
const router = useRouter()

const history = ref([])


const sodiumChartData = computed(() => {

  const daily = {}

  history.value.forEach(item => {

    const d = new Date(item.eaten_at)

    const key =
      d.toISOString()
        .split('T')[0]

    if (!daily[key]) {
      daily[key] = 0
    }

    daily[key] += Number(
      item.foods?.sodium || 0
    )
  })

  return Object.entries(daily)
    .sort((a, b) =>
      new Date(a[0]) -
      new Date(b[0])
    )
    .map(([date, sodium]) => ({

      date:
        new Date(date)
        .toLocaleDateString(
          'th-TH',
          {
            day: 'numeric',
            month: 'short'
          }
        ),

      sodium
    }))
})

const title = ref('')

const currentPage = ref(1)
const itemsPerPage = 5

const chartData = computed(() => ({

  labels:
    sodiumChartData.value.map(
      x => x.date
    ),

  datasets: [
    {
      label: 'โซเดียม (mg)',

      data:
        sodiumChartData.value.map(
          x => x.sodium
        ),

      backgroundColor:
        sodiumChartData.value.map(
          x =>
            x.sodium > 2000
              ? '#ef5350'
              : '#42b883'
        ),

      borderRadius: 8
    },


  ]
}))

const chartOptions = {

  responsive: true,

  plugins: {

    legend: {
      display: false
    },

    annotation: {

      annotations: {

        sodiumLimit: {

          type: 'line',

          yMin: 2000,
          yMax: 2000,

          borderColor: '#ff9800',

          borderWidth: 3,

          borderDash: [8, 5],

          label: {
            display: true,
            content: '2000 mg',
            position: 'end'
          }
        }
      }
    }
  },

  scales: {

    y: {
      beginAtZero: true,

      title: {
        display: true,
        text: 'mg'
      }
    }
  }
}

const greenCount = computed(() =>
  history.value.filter(
    item => item.food_level === 'green'
  ).length
)

const yellowCount = computed(() =>
  history.value.filter(
    item => item.food_level === 'yellow'
  ).length
)

const redCount = computed(() =>
  history.value.filter(
    item => item.food_level === 'red'
  ).length
)

const totalMeals = computed(() =>
  history.value.length
)

const greenPercent = computed(() =>
  totalMeals.value
    ? Math.round(
        (greenCount.value /
          totalMeals.value) *
          100
      )
    : 0
)

const yellowPercent = computed(() =>
  totalMeals.value
    ? Math.round(
        (yellowCount.value /
          totalMeals.value) *
          100
      )
    : 0
)

const redPercent = computed(() =>
  totalMeals.value
    ? Math.round(
        (redCount.value /
          totalMeals.value) *
          100
      )
    : 0
)


const totalPages = computed(() =>
  Math.ceil(
    history.value.length /
    itemsPerPage
  )
)

const paginatedHistory =
computed(() => {

  const start =
    (currentPage.value - 1) *
    itemsPerPage

  const end =
    start + itemsPerPage

  return history.value.slice(
    start,
    end
  )
})

const loadHistory =
async () => {

  const user =
    JSON.parse(
      localStorage.getItem(
        'user'
      )
    )

  const month =
    route.params.month

  const [year, monthNum] =
    month.split('-')

  title.value =
    new Date(
      year,
      monthNum - 1
    )
      .toLocaleDateString(
        'th-TH',
        {
          month: 'long',
          year: 'numeric'
        }
      )

  const startDate =
  new Date(year, monthNum - 1, 1)

  const endDate =
  new Date(
    year,
    monthNum,
    0,
    23,
    59,
    59
  )

  const { data } =
    await supabase
      .from('meal_logs')
      .select(`
        *,
        foods(
          food_name,
          image_url,
          sodium
        )
      `)
      .eq(
        'user_id',
        user.id
      )
      .gte(
        'eaten_at',
        startDate.toISOString()
        )
        .lte(
        'eaten_at',
        endDate.toISOString()
        )
      .order(
        'eaten_at',
        {
          ascending: false
        }
      )

  history.value = data || []
  console.log('DATA', data)
  console.log('CHART', sodiumChartData.value)
}

const formatDate = (date) => {

  return new Date(date)
    .toLocaleString(
      'th-TH',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',

        hour: '2-digit',
        minute: '2-digit',

        hour12: false
      }
    )
}

const levelText =
(level) => {

  if (
    level === 'green'
  )
    return '🟢 ดี'

  if (
    level === 'yellow'
  )
    return '🟡 ปานกลาง'

  return '🔴 ควรลด'
}

onMounted(
  loadHistory
)
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: auto;
  padding: 20px;
}

.back-btn {
  border: none;
  background: #eee;
  padding: 10px 16px;
  border-radius: 10px;
  margin-bottom: 15px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.history-card {
  display: flex;
  gap: 12px;

  background: white;

  padding: 12px;

  border-radius: 14px;

  margin-bottom: 12px;

  box-shadow:
    0 2px 8px rgba(0,0,0,.08);
}

.food-image {
  width: 80px;
  height: 80px;

  object-fit: cover;

  border-radius: 10px;
}

.food-info {
  flex: 1;
}

.food-info h4 {
  margin: 0;
}

.food-info p {
  margin: 8px 0;
}

.summary-card {
  background: white;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;

  box-shadow:
    0 4px 12px rgba(0,0,0,.08);
}

.summary-info {
  margin-top: 15px;

  display: flex;
  flex-wrap: wrap;

  gap: 10px;
}

.summary-info div {
  background: #f5f5f5;

  padding: 10px 14px;

  border-radius: 10px;

  font-weight: bold;
}

.sodium {
  background: #fff3cd !important;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 15px;

  margin-top: 25px;
}

.pagination button {
  border: none;

  background: #42b883;
  color: white;

  padding: 10px 16px;

  border-radius: 10px;

  cursor: pointer;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.chart-wrapper {
  position: relative;
  height: 350px;
}
</style>