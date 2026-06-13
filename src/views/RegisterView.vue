<template>
  <div class="container">
    <h1>สมัครสมาชิก</h1>

    <input v-model="fullname" placeholder="ชื่อ-นามสกุล" />

  <input
    v-model="phone"
    placeholder="เบอร์โทรศัพท์"
    maxlength="10"
    inputmode="numeric"
    @input="phone = phone.replace(/\D/g, '')"
  />
    <button @click="register">สมัครสมาชิก</button>
  </div>

  <div v-if="isSuccessOpen" class="modal-overlay">
  <div class="modal-card">
    <div class="success-icon">✅</div>
    <h2>สมัครสมาชิกสำเร็จ</h2>
    <p>ยินดีต้อนรับ {{ fullname }}</p>
    <button class="confirm-btn" @click="goLogin">เข้าสู่ระบบ</button>
  </div>
</div>

<div v-if="isErrorOpen" class="modal-overlay">
  <div class="modal-card">
    <div class="error-icon">❌</div>
    <h2>เกิดข้อผิดพลาด</h2>
    <p>{{ errorMessage }}</p>
    <button class="error-btn" @click="isErrorOpen = false">ตกลง</button>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const fullname = ref('')
const phone = ref('')

const router = useRouter()

const isSuccessOpen = ref(false)
const isErrorOpen = ref(false)
const errorMessage = ref('')

const showError = (msg) => {
  errorMessage.value = msg
  isErrorOpen.value = true
}

const register = async () => {
  if (!fullname.value || !phone.value) {
    alert('กรอกข้อมูลให้ครบ')
    return
  }

  // ตรวจเบอร์โทร: ต้องขึ้นต้นด้วย 0, ตามด้วยตัวเลข 9 ตัว รวม 10 หลัก
  const phoneRegex = /^0[689]\d{8}$/
  if (!phoneRegex.test(phone.value)) {
    showError('เบอร์โทรศัพท์ไม่ถูกต้อง\nต้องเป็นเบอร์มือถือ 10 หลัก (06x, 08x, 09x)')
    return
  }

  const { error } = await supabase
    .from('users')
    .insert([{ fullname: fullname.value, phone: phone.value }])

  if (error) {
    alert(error.message)
    return
  }

  isSuccessOpen.value = true  
}

const goLogin = () => {
  router.push('/login')
}


</script>

<style scoped>
.container {
  max-width: 420px;
  margin: 60px auto;
  padding: 30px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 32px;
  color: #2c3e50;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  margin-bottom: 16px;

  font-size: 18px;

  border: 1px solid #dcdfe6;
  border-radius: 12px;

  outline: none;
}

input:focus {
  border-color: #42b883;
}

button {
  width: 100%;
  padding: 16px;

  font-size: 18px;
  font-weight: bold;

  border: none;
  border-radius: 12px;

  background: #42b883;
  color: white;

  cursor: pointer;
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

.success-icon {
  font-size: 60px;
  margin-bottom: 10px;
}

.modal-card h2 {
  color: #42b883;
  margin-bottom: 8px;
}

.modal-card p {
  font-size: 16px;
  margin-bottom: 20px;
  color: #555;
}

.confirm-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #42b883;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.error-icon {
  font-size: 60px;
  margin-bottom: 10px;
}

.error-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #ef5350;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

@keyframes popup {
  from { transform: scale(.8); opacity: 0; }
  to   { transform: scale(1);  opacity: 1; }
}
</style>
