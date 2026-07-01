

<template>
  <div class="container">
    <div class="welcome-card">
      <h2>
        สวัสดี {{ fullname }}
      </h2>

      <p>
        สรุปการกินประจำวันที่ {{ currentDate }}
      </p>
    </div>

    <div class="chart-card">
      <FoodPieChart
        :green="greenCount"
        :yellow="yellowCount"
        :red="redCount"
      />
    </div>

    <div class="sodium-card">

      <div class="sodium-header">
        <span>
          🧂 โซเดียมวันนี้
        </span>

        <strong>
          {{ Number(sodiumToday).toLocaleString() }}
          / 2,000 mg
        </strong>
      </div>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{
            width:
              sodiumPercent + '%'
          }"
        />
      </div>

      <p class="progress-text">
        {{ sodiumPercent }}%
        ของปริมาณที่แนะนำต่อวัน
      </p>

</div>

    <div class="summary-card">
      <div class="summary green">
        🟢 ดี
        <strong>
          {{ greenPercent }}%
        </strong>
      </div>

      <div class="summary yellow">
        🟡 ปานกลาง
        <strong>
          {{ yellowPercent }}%
        </strong>
      </div>

      <div class="summary red">
        🔴 แย่
        <strong>
          {{ redPercent }}%
        </strong>
      </div>

    
    </div>

    <div class="sodium-card">
      <div class="remark-sodium">
        
      <p>หมายเหตุ </p>
      <p>1.ไม่ควรทานโซเดียมเกิน 650 mg/มื้ออาหาร (3 มื้อ/วัน)</p>
      <p>2.หากทานโซเดียมเกิน 2000 mg/วัน เป็นระยะเวลานาน จะนำไปสู่การเป็นโรคความดันโลหิตสูง</p>
      <p style="color: green; font-weight: bold;">คำแนะนำ:</p>
      <ul>
        <li style="color: green;">ควรดื่มน้ำให้เพียงพอเพื่อให้โซเดียมขับออกทางปัสสาวะ</li>
        <li style="color: green;">ออกกำลังกายเพื่อให้ร่างกายขับโซเดียมออกทางเหงื่อ</li>
        <li style="color: green;">ทานผักหรือผลไม้ที่มีโพแทสเซียม ไม่เหมาะกับผู้ป่วยโรคไต เช่น กล้วยหอม แตงกวา น้ำมะพร้าว</li>
        <li style="color: green;">ลดการทานเค็มในมื้อถัดไป</li>
      </ul>
    </div>

    </div>
    
    

    <button
      class="main-btn"
      @click="router.push('/foods')"
    >
      🍽️ บันทึกอาหาร
    </button>

    <button
      class="secondary-btn"
      @click="router.push('/history')"
    >
      📖 ประวัติการกิน
    </button>

    <button
      class="logout-btn"
      @click="logout"
    >
      🚪 ออกจากระบบ
    </button>
  </div>

  <div v-if="isLogoutOpen" class="modal-overlay">
  <div class="modal-card">
    <p style="font-size:18px; margin-bottom:20px;">ต้องการออกจากระบบ ?</p>
    <div class="modal-buttons">
      <button class="cancel-btn" @click="isLogoutOpen = false">ยกเลิก</button>
      <button class="confirm-btn" @click="confirmLogout">ออกจากระบบ</button>
    </div>
  </div>
</div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import FoodPieChart from '@/components/FoodPieChart.vue'
import { supabase } from '@/lib/supabase'

const currentDate = ref('')


const router = useRouter()

const fullname = ref('')

const greenCount = ref(0)
const yellowCount = ref(0)
const redCount = ref(0)

const history = ref([])

const sodiumToday = ref(0)



const sodiumPercent = computed(() => {
  return Math.min(
    Math.round(
      (sodiumToday.value / 2000) * 100
    ),
    100
  )
})

const TIMEOUT_MS = 10 * 60 * 1000 // 10 นาที
let logoutTimer = null



const totalMeals = computed(() =>
  greenCount.value +
  yellowCount.value +
  redCount.value
)

const greenPercent = computed(() => {
  if (totalMeals.value === 0) return 0

  return Math.round(
    (greenCount.value /
      totalMeals.value) *
      100
  )
})

const yellowPercent = computed(() => {
  if (totalMeals.value === 0) return 0

  return Math.round(
    (yellowCount.value /
      totalMeals.value) *
      100
  )
})

const redPercent = computed(() => {
  if (totalMeals.value === 0) return 0

  return Math.round(
    (redCount.value /
      totalMeals.value) *
      100
  )
})

const loadDashboard = async () => {

  const user = JSON.parse(
    localStorage.getItem('user')
  )

  if (!user) {
    router.push('/login')
    return
  }

  fullname.value = user.fullname

  currentDate.value =
    new Date().toLocaleDateString(
      'th-TH',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    )

const today = new Date()

const todayStart =
  new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,0,0
  )

const todayEnd =
  new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,59,59
  )

const { data, error } =
  await supabase
    .from('meal_logs')
    .select(`
      *,
      foods(
        sodium
      )
    `)
    .eq('user_id', user.id)
    .gte(
      'eaten_at',
      todayStart.toISOString()
    )
    .lte(
      'eaten_at',
      todayEnd.toISOString()
    )

  history.value = data || []

  sodiumToday.value =
  history.value.reduce(
    (sum, item) =>
      sum +
      Number(
        item.foods?.sodium || 0
      ),
    0
  )

  greenCount.value =
    data.filter(
      x =>
        x.food_level === 'green'
    ).length

  yellowCount.value =
    data.filter(
      x =>
        x.food_level === 'yellow'
    ).length

  redCount.value =
    data.filter(
      x =>
        x.food_level === 'red'
    ).length
}

const isLogoutOpen = ref(false)

const logout = () => {
  isLogoutOpen.value = true
}

const resetTimer = () => {
  clearTimeout(logoutTimer)
  logoutTimer = setTimeout(() => {
    localStorage.removeItem('user')
    router.push('/login')
  }, TIMEOUT_MS)
}

const startAutoLogout = () => {
  const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll']
  events.forEach(e => window.addEventListener(e, resetTimer))
  resetTimer() // เริ่มนับครั้งแรก
}

const stopAutoLogout = () => {
  clearTimeout(logoutTimer)
  const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll']
  events.forEach(e => window.removeEventListener(e, resetTimer))
}

const confirmLogout = () => {
  stopAutoLogout()
  localStorage.removeItem('user')
  router.push('/login')
}



onMounted(() => {
  loadDashboard()
  startAutoLogout()
})

onUnmounted(() => {
  stopAutoLogout()
})
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}

.welcome-card {
  text-align: center;
  margin-bottom: 20px;
}

.welcome-card h2 {
  margin-bottom: 5px;
}

.chart-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow:
    0 4px 12px
      rgba(0,0,0,.08);
}

.summary-card {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary {
  display: flex;
  justify-content: space-between;
  padding: 14px;
  border-radius: 12px;
  font-size: 18px;
}

.green {
  background: #e8f5e9;
}

.yellow {
  background: #fff8e1;
}

.red {
  background: #ffebee;
}

.meal-total {
  text-align: center;
  margin: 25px 0;
  font-size: 22px;
}

.main-btn {
  width: 100%;
  border: none;
  background: #4caf50;
  color: white;
  padding: 18px;
  border-radius: 14px;
  font-size: 18px;
  margin-bottom: 12px;
  margin-top: 20px;
}

.secondary-btn {
  width: 100%;
   
  border: none;
  background: #2196f3;
  color: white;
  padding: 18px;
  border-radius: 14px;
  font-size: 18px;
}

.logout-btn {
  width: 100%;
  border: none;
  background: #ef5350;
  color: white;
  padding: 18px;
  border-radius: 14px;
  font-size: 18px;
  margin-top: 12px;
  cursor: pointer;
}

.remark-sodium{
  color: #ff0000;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-card {
  width: 90%;
  max-width: 320px;
  background: white;
  border-radius: 24px;
  padding: 30px;
  text-align: center;
  animation: popup .25s ease;
}

.modal-buttons {
  display: flex;
  gap: 10px;
}

.modal-buttons button {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
}

.cancel-btn { background: #e0e0e0; }

.confirm-btn {
  background: #ef5350;
  color: white;
}

.sodium-card {
  background: white;
  margin-top: 20px;
  padding: 16px;
  border-radius: 16px;

  box-shadow:
    0 4px 12px
    rgba(0,0,0,.08);
}

.sodium-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 18px;

  background: #eee;

  border-radius: 999px;

  overflow: hidden;
}

.progress-fill {
  height: 100%;

  background:
    linear-gradient(
      90deg,
      #4caf50,
      #ff9800,
      #f44336
    );

  transition: .3s;
}

.progress-text {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}

@keyframes popup {
  from { transform: scale(.8); opacity: 0; }
  to   { transform: scale(1);  opacity: 1; }
}
</style>