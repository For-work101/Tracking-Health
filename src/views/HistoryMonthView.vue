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

  <FoodPieChart
    :green="greenCount"
    :yellow="yellowCount"
    :red="redCount"
  />

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
import FoodPieChart from '@/components/FoodPieChart.vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import { supabase }
from '@/lib/supabase'

const route = useRoute()
const router = useRouter()

const history = ref([])
const title = ref('')

const currentPage = ref(1)
const itemsPerPage = 5

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

const sodiumTotal = computed(() => {
  return history.value.reduce(
    (sum, item) =>
      sum + (item.foods?.sodium || 0),
    0
  )
})

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
new Date(year, monthNum, 0)

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

  history.value =
    data || []
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
</style>