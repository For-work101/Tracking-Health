<template>
  <div class="container">
    <h2>🍽️ จัดการอาหาร</h2>

    <div class="form-card">
      <input
        v-model="foodName"
        placeholder="ชื่ออาหาร"
      />

      <select v-model="foodLevel">
        <option value="green">🟢 ดี</option>
        <option value="yellow">🟡 ปานกลาง</option>
        <option value="red">🔴 แย่</option>
      </select>

      <input
        v-model="sodium"
        placeholder="โซเดียม (mg) เช่น 800 หรือ 800-900"
      />

      <input
        type="file"
        accept="image/*"
        @change="handleFileChange"
      />

      <img
        v-if="previewUrl"
        :src="previewUrl"
        class="preview"
      />

      <button
        class="save-btn"
        @click="saveFood"
        >
        {{
            editingId
            ? '💾 บันทึกการแก้ไข'
            : '➕ เพิ่มอาหาร'
        }}
        </button>
      <input
        v-model="searchText"
        class="search-input"
        placeholder="🔍 ค้นหาชื่ออาหาร"
        />
    </div>

    

    <div class="food-list">
      <div
        v-for="food in filteredFoods"
        :key="food.id"
        class="food-card"
      >
        <img
          :src="
            food.image_url ||
            'https://placehold.co/100x100'
          "
          class="food-image"
        />

        <div class="food-info">
          <h4>
            {{ food.food_name }}
          </h4>

          <p>
            {{ levelText(food.food_level) }}
          </p>
          <p>
            🧂 {{ food.sodium || 0 }} mg
        </p>
        </div>

        <div class="action-group">

            <button
                class="edit-btn"
                @click="editFood(food)"
            >
                ✏️
            </button>

            <button
                class="delete-btn"
                @click="deleteFood(food.id)"
            >
                🗑️
            </button>

            </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue'


import { supabase }
from '@/lib/supabase'

const foodName = ref('')
const foodLevel = ref('green')

const foods = ref([])

const sodium = ref(0)

const selectedFile = ref(null)
const previewUrl = ref('')
const searchText = ref('')

const editingId = ref(null)

const filteredFoods = computed(() => {

  if (!searchText.value)
    return foods.value

  return foods.value.filter(food =>
    food.food_name
      .toLowerCase()
      .includes(
        searchText.value.toLowerCase()
      )
  )
})

const handleFileChange = (
  event
) => {
  const file =
    event.target.files[0]

  if (!file) return

  selectedFile.value = file

  previewUrl.value =
    URL.createObjectURL(file)
}



const uploadImage = async () => {
  if (!selectedFile.value)
    return null

  const ext =
    selectedFile.value.name
      .split('.')
      .pop()

  const fileName =
    `${Date.now()}.${ext}`

  const { error } =
    await supabase.storage
      .from('food-images')
      .upload(
        fileName,
        selectedFile.value
      )

  if (error) {
    throw error
  }

  const { data } =
    supabase.storage
      .from('food-images')
      .getPublicUrl(fileName)

  return data.publicUrl
}

const saveFood = async () => {
  try {

    if (!foodName.value) {
      alert('กรอกชื่ออาหาร')
      return
    }

    let imageUrl = null

    if (selectedFile.value) {
      imageUrl = await uploadImage()
    }

    // EDIT
    if (editingId.value) {

      const payload = {
        food_name: foodName.value,
        food_level: foodLevel.value,
        sodium: sodium.value
      }

      if (imageUrl) {
        payload.image_url = imageUrl
      }

      const { error } =
        await supabase
          .from('foods')
          .update(payload)
          .eq(
            'id',
            editingId.value
          )

      if (error)
        throw error

      alert('แก้ไขสำเร็จ')
    }

    // INSERT
    else {

      const { error } =
        await supabase
          .from('foods')
          .insert([
            {
                food_name:foodName.value,
                food_level:foodLevel.value,
                sodium: sodium.value,
                image_url:imageUrl
            }
          ])

      if (error)
        throw error

        if (!sodium.value) {
          alert('กรอกปริมาณโซเดียม')
          return
        }

        if (!validateSodium(sodium.value)) {
          alert('รูปแบบโซเดียมไม่ถูกต้อง\nเช่น 800 หรือ 800-900')
          return
        }

      alert('เพิ่มอาหารสำเร็จ')
    }

    resetForm()

    loadFoods()

  } catch (error) {
    alert(error.message)
  }

  
}

const resetForm = () => {

  editingId.value = null
  foodName.value = ''
  foodLevel.value = 'green'
  selectedFile.value = null
  previewUrl.value = ''
  sodium.value = ''
}

const editFood = (food) => {

    editingId.value = food.id
    foodName.value = food.food_name
    foodLevel.value = food.food_level
    previewUrl.value = food.image_url || ''
    sodium.value = food.sodium || ''

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const loadFoods = async () => {
  const { data, error } =
    await supabase
      .from('foods')
      .select('*')
      .eq('is_active', true)
      .order(
        'created_at',
        {
          ascending: false
        }
      )

  if (error) {
    console.error(error)
    return
  }

  foods.value =
    data || []
}

const deleteFood = async (id) => {
  if (!confirm('ต้องการลบอาหารนี้ ?')) return

  const { error } = await supabase
    .from('foods')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    alert(error.message)
    return
  }

  loadFoods()
}

const levelText = (
  level
) => {

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

const validateSodium = (val) => {
  // รับทั้งแบบ "800" และ "800-900"
  const rangeRegex = /^\d+(-\d+)?$/
  if (!rangeRegex.test(val)) return false

  const parts = val.split('-')
  if (parts.length === 2) {
    return Number(parts[0]) < Number(parts[1])  // ตัวแรกต้องน้อยกว่าตัวหลัง
  }
  return true
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

.form-card {
  background: white;

  padding: 20px;

  border-radius: 16px;

  display: flex;
  flex-direction: column;

  gap: 12px;

  margin-bottom: 20px;

  box-shadow:
    0 4px 12px
    rgba(0,0,0,.08);
}

input,
select {
  padding: 14px;

  border: 1px solid #ddd;

  border-radius: 10px;
}

.save-btn {
  background: #4caf50;
  color: white;

  border: none;

  padding: 14px;

  border-radius: 10px;

  cursor: pointer;
}

.preview {
  width: 100%;

  max-height: 250px;

  object-fit: cover;

  border-radius: 12px;
}

.food-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.food-card {
  display: flex;
  align-items: center;

  gap: 12px;

  background: white;

  padding: 12px;

  border-radius: 12px;

  box-shadow:
    0 2px 6px
    rgba(0,0,0,.05);
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
  margin-top: 6px;
}

.delete-btn {
  border: none;
  background: #ffebee;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 16px;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
}

.search-input {
  width: 100%;
  box-sizing: border-box;

  margin-bottom: 15px;
}

.action-group {
  display: flex;
  gap: 8px;
}

.edit-btn {
  background: #fff3cd;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}

.delete-btn {
  background: #ffebee;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}

</style>