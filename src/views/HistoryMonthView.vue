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

    <div
      v-for="item in history"
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

  </div>
</template>

<script setup>
import {
  ref,
  onMounted
} from 'vue'

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

const formatDate =
(date) => {

  return new Date(
    date
  )
  .toLocaleDateString(
    'th-TH',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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
</style>