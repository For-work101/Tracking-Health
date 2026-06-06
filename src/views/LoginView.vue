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
