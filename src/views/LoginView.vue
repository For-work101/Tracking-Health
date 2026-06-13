<template>
  <div class="container">
    <h1>TRACKING FOOD</h1>

    <input v-model="phone" type="tel" placeholder="เบอร์โทรศัพท์" />

    <button @click="login">เข้าสู่ระบบ</button>

    <p>
      ยังไม่มีบัญชี?
      <RouterLink to="/register"> สมัครสมาชิก </RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const phone = ref('')
const router = useRouter()

import { supabase } from '@/lib/supabase'

const login = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone.value)
    .single()

  if (error || !data) {
    alert('ไม่พบผู้ใช้งาน')
    return
  }

  localStorage.setItem(
    'user',
    JSON.stringify(data)
  )

  // แยกตาม role
  if (data.role === 'admin') {
    router.push('/admin')
  } else {
    router.push('/dashboard')
  }
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

  transition: 0.2s;
}

button:hover {
  opacity: 0.9;
}

p {
  text-align: center;
  margin-top: 20px;
}

a {
  color: #42b883;
  text-decoration: none;
  font-weight: bold;
}
</style>
