<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const previewImage = ref(null)
const mealRate = ref('')

const openCamera = () => {
  fileInput.value.click()
}

const onSelectFile = (event) => {
  const file = event.target.files[0]

  if (!file) return

  previewImage.value = URL.createObjectURL(file)
}

const saveMeal = () => {
  alert('บันทึกสำเร็จ')

  previewImage.value = null

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="container">
    <h2>บันทึกอาหาร</h2>

    <button
      class="camera-btn"
      @click="openCamera"
    >
      📷 ถ่ายรูปอาหาร
    </button>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      capture="environment"
      hidden
      @change="onSelectFile"
    />

    <div
      v-if="previewImage"
      class="preview"
    >
      <img
        :src="previewImage"
        alt="food"
      />

      <div class="foodqc">
        <div>คุณภาพอาหาร</div>
        <div class="rate-group">
            
            <button
                :class="[
                'rate-btn',
                mealRate === 'good' ? 'selected' : '',
                'good'
                ]"
                @click="mealRate = 'good'"
            >
                
            </button>

            <button
                :class="[
                'rate-btn',
                mealRate === 'medium' ? 'selected' : '',
                'medium'
                ]"
                @click="mealRate = 'medium'"
            >
                
            </button>

            <button
                :class="[
                'rate-btn',
                mealRate === 'bad' ? 'selected' : '',
                'bad'
                ]"
                @click="mealRate = 'bad'"
            >
                
            </button>
            </div>
        </div>

      <div class="btn-group">
        <button
          class="retake-btn"
          @click="openCamera"
        >
          📷 ถ่ายใหม่
        </button>

        <button
          class="save-btn"
          @click="saveMeal"
        >
          💾 บันทึก
        </button>
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

.camera-btn,
.save-btn,
.retake-btn {
  width: 100%;
  padding: 18px;
  font-size: 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.preview {
  margin-top: 20px;
}

.preview img {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 15px;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.btn-group button {
  flex: 1;
}

.foodqc{
    display: flex;
    gap: 5px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.rate-group {
  display: flex;
  flex-direction:  row;
  gap: 10px;
  margin-top: 15px;
}

.rate-btn {
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 18px;
  color: white;
}

.good {
  background: #2e7d32;
}

.medium {
  background: #f9a825;
}

.bad {
  background: #c62828;
}

.selected {
  transform: scale(1.5);
  font-weight: bold;
}
</style>