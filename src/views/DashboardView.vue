<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const showHistory = ref(false)

const meals = ref([
  {
    id: 1,
    foodName: 'ข้าวต้มปลา',
    image: 'https://placehold.co/300x200',

  },
  {
    id: 2,
    foodName: 'แกงจืดเต้าหู้',
    image: 'https://placehold.co/300x200',

  },
  {
    id: 2,
    foodName: 'กะเพราหมูสับ',
    image: 'https://placehold.co/300x200',

  },
])

const goToMeal = () => {
  router.push('/meal')
}
</script>

<template>
  <div class="container">
    <h2>สวัสดี คุณสมชาย</h2>

    <button
      class="action-btn"
      @click="goToMeal"
    >
      📷 ถ่ายรูปอาหาร
    </button>

    <button
      class="action-btn"
      @click="showHistory = true"
    >
      📖 ประวัติการกิน
    </button>

    <!-- Popup -->

    <div
      v-if="showHistory"
      class="overlay"
    >
      <div class="popup">
        <div class="popup-header">
          <h3>ประวัติการกิน</h3>

          <button
            class="close-btn"
            @click="showHistory = false"
          >
            ✕
          </button>
        </div>

        <div
          v-for="meal in meals"
          :key="meal.id"
          class="meal-card"
        >
          <img :src="meal.image" />

          <div class="meal-info">
            <h4>{{ meal.foodName }}</h4>
            <p>{{ meal.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}

.action-btn {
  width: 100%;
  padding: 18px;
  margin-bottom: 15px;
  font-size: 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;

  background: white;
  border-radius: 15px;
  padding: 15px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
}

.meal-card {
  margin-top: 15px;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
}

.meal-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.meal-info {
  padding: 10px;
}
</style>