<template>
  <div class="container">

    <h2>🍽️ บันทึกอาหาร</h2>

    <input
      v-model="search"
      class="search-input"
      placeholder="🔍 ค้นหาชื่ออาหาร"
    />

    <div class="food-grid">
      <div
        v-for="food in filteredFoods"
        :key="food.id"
        class="food-card"
        :class="food.food_level"
      >
        <img
          :src="food.image_url"
          class="food-image"
        >

        <div class="food-name">
          {{ food.food_name }}
        </div>

        <div class="food-sodium">
          โซเดียม {{ food.sodium || 0 }} mg
        </div>

       <button
        class="eat-btn"
        @click="openModal(food)"
      >
        เลือกอาหาร
      </button>

      </div>

    </div>

    <div
      v-if="filteredFoods.length === 0"
      class="empty"
    >
      ไม่พบข้อมูลอาหาร
    </div>

  </div>

  <div
  v-if="isModalOpen"
  class="modal-overlay"
>
  <div class="modal-card">

    <img
      :src="selectedFood?.image_url"
      class="modal-image"
    >

    <h2>
      {{ selectedFood?.food_name }}
    </h2>

    <p>
      ต้องการบันทึกอาหารนี้หรือไม่?
    </p>

    <div class="modal-buttons">

      <button
        class="cancel-btn"
        @click="closeModal"
      >
        ยกเลิก
      </button>

      <button
        class="confirm-btn"
        @click="eatFood"
      >
        ยืนยัน
      </button>

    </div>

  </div>
</div>

<div
  v-if="isSuccessOpen"
  class="modal-overlay"
>
  <div class="success-card">

    <div class="success-icon">
      ✅
    </div>

    <h2>
      บันทึกสำเร็จ
    </h2>

    <p>
      {{ successFoodName }}
    </p>

    <button
      class="success-btn"
      @click="
        isSuccessOpen = false
      "
    >
      ตกลง
    </button>

  </div>
</div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue'

import { supabase } from '@/lib/supabase'

const foods = ref([])
const search = ref('')

const selectedFood = ref(null)
const isModalOpen = ref(false)

const isSuccessOpen = ref(false)
const successFoodName = ref('')

const openModal = (food) => {
  selectedFood.value = food
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedFood.value = null
}

const filteredFoods = computed(() => {
  if (!search.value)
    return foods.value

  return foods.value.filter(
    food =>
      food.food_name
        .toLowerCase()
        .includes(
          search.value.toLowerCase()
        )
  )
})

const loadFoods = async () => {
  const { data, error } =
    await supabase
      .from('foods')
      .select('*')
      .eq('is_active', true) 
      .order('food_name')

  if (error) {
    console.error(error)
    return
  }

  foods.value = data || []
}

const eatFood = async () => {

  const user = JSON.parse(
    localStorage.getItem('user')
  )

  const { error } =
    await supabase
      .from('meal_logs')
      .insert([
        {
          user_id: user.id,
          food_id: selectedFood.value.id,
          food_level:selectedFood.value.food_level,
          sodium: selectedFood.value.sodium
        }
      ])

  if (error) {
    alert(error.message)
    return
  }

  const foodName =
    selectedFood.value.food_name

  closeModal()

  successFoodName.value =
    foodName

  isSuccessOpen.value = true
  }

onMounted(() => {
  loadFoods()
})
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

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
}


.green {
  color: #2e7d32;
}

.yellow {
  color: #f9a825;
}

.red {
  color: #d32f2f;
}


.container {
  max-width: 500px;
  margin: auto;
  padding: 16px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  border: none;
  border-radius: 18px;
  background: white;
  font-size: 16px;
  margin-bottom: 20px;
  box-shadow:
    0 2px 8px rgba(0,0,0,.08);
}

/* Grid */

.food-grid {
  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 14px;
}

/* Card */

.food-card {
  border-radius: 18px;

  padding: 10px;

  text-align: center;

  box-shadow:
    0 4px 10px rgba(0,0,0,.08);
}

/* สีพื้นตามระดับ */

.food-card.green {
  background: #3aca06;
}

.food-card.yellow {
  background: #fff534;
}

.food-card.red {
  background: #d92222;
}

/* รูป */

.food-image {
  width: 100%;
  height: 140px;
  border-radius: 12px;
  object-fit: cover;
  background: white;
}

/* ชื่ออาหาร */

.food-name {
  margin-top: 1px;
  font-size: 16px;
  font-weight: 700;
  min-height: 45px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ปุ่ม */

.eat-btn {
  width: 100%;
  margin-top: 1px;
  border: none;
  background: white;
  color: #4caf50;
  font-weight: bold;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
}

.empty {
  text-align: center;
  color: #999;
  margin-top: 40px;
}


.empty {
  text-align: center;
  color: #888;
  margin-top: 40px;
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
  max-width: 350px;

  background: white;

  border-radius: 24px;

  padding: 24px;

  text-align: center;

  animation: popup .25s ease;
}

.modal-image {
  width: 120px;
  height: 120px;

  object-fit: cover;

  border-radius: 20px;

  margin-bottom: 15px;
}

.modal-card h3 {
  margin-bottom: 8px;
}

.modal-card h2 {
  margin: 10px 0 20px;
  color: #42b883;
}

.close-btn {
  width: 100%;

  border: none;

  background: #42b883;

  color: white;

  padding: 14px;

  border-radius: 12px;

  font-size: 16px;

  cursor: pointer;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.modal-buttons button {
  flex: 1;
}

.cancel-btn {
  border: none;
  background: #e0e0e0;
  padding: 14px;
  border-radius: 12px;
}

.confirm-btn {
  border: none;
  background: #42b883;
  color: white;
  padding: 14px;
  border-radius: 12px;
  cursor: pointer;
}

.food-sodium{
  font-size:14px;
  color:#666;
  margin-bottom: 8px;
}

@keyframes popup {
  from {
    transform: scale(.8);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 600px) {

  .food-card {
    gap: 10px;
  }

  .food-image {
    width: 70px;
    height: 70px;
  }

  .eat-btn {
    padding: 10px;
    font-size: 14px;
  }
}

.success-card {
  width: 90%;
  max-width: 320px;
  background: white;
  border-radius: 24px;
  padding: 30px;
  text-align: center;
  animation:
    popup .25s ease;
}

.success-icon {
  font-size: 60px;
  margin-bottom: 10px;
}

.success-card h2 {
  color: #42b883;
  margin-bottom: 10px;
}

.success-card p {
  font-size: 18px;
  margin-bottom: 20px;
}

.success-btn {
  width: 100%;
  border: none;
  background: #42b883;
  color: white;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
}
</style>