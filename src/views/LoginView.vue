<template>
  <div class="container">
    <h1>เข้าสู่ระบบ</h1>

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

const login = () => {
  localStorage.setItem('phone', phone.value)

  router.push('/dashboard')
}
</script>
