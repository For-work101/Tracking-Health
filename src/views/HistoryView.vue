<template>
  <div class="container">

    <button
      class="back-btn"
      @click="router.back()"
    >
      ← กลับ
    </button>

    <h2>
      📖 ประวัติการกิน
    </h2>

    <div
      v-for="month in monthGroups"
      :key="month.key"
      class="month-card"
      @click="openMonth(month.key)"
    >
      <div>
        <h3>
          {{ month.month }}
        </h3>

        <p>
          {{ month.count }} ครั้ง
        </p>
      </div>

      <div class="arrow">
        >
      </div>
    </div>

    <div
      v-if="monthGroups.length === 0"
      class="empty"
    >
      ยังไม่มีประวัติการกิน
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { supabase } from '@/lib/supabase'

const router = useRouter()

const monthGroups = ref([])

const loadHistory = async () => {

  const user = JSON.parse(
    localStorage.getItem('user')
  )

  const { data, error } =
    await supabase
      .from('meal_logs')
      .select('*')
      .eq(
        'user_id',
        user.id
      )
      .order(
        'eaten_at',
        {
          ascending: false
        }
      )

  if (error) {
    console.error(error)
    return
  }

  const groups = {}

  data.forEach(item => {

    const date =
      new Date(
        item.eaten_at
      )

    const key =
      `${date.getFullYear()}-${
        date.getMonth() + 1
      }`

    if (!groups[key]) {

      groups[key] = {
        key,

        month:
          date.toLocaleDateString(
            'th-TH',
            {
              month: 'long',
              year: 'numeric'
            }
          ),

        count: 0
      }
    }

    groups[key].count++
  })

  monthGroups.value =
    Object.values(groups)
}

const openMonth = (
  monthKey
) => {

  router.push(
    `/history/${monthKey}`
  )
}

onMounted(loadHistory)
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.month-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 18px;
  margin-bottom: 12px;
  border-radius: 16px;
  cursor: pointer;
  box-shadow:
    0 2px 8px rgba(0,0,0,.08);
}

.back-btn {
  border: none;
  background: #eee;
  padding: 10px 16px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.arrow {
  font-size: 22px;
  font-weight: bold;
}

.empty {
  text-align: center;
  margin-top: 50px;
  color: #888;
}
</style>