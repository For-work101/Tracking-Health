<template>
  <div class="container">
    <h1>สมัครสมาชิก</h1>

    <input v-model="fullname" placeholder="ชื่อ-นามสกุล" />

    <input v-model="phone" placeholder="เบอร์โทรศัพท์" />

    <button @click="register">สมัครสมาชิก</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const fullname = ref('')
const phone = ref('')

const router = useRouter()

const register = () => {
  alert('สมัครสมาชิกสำเร็จ')

  router.push('/login')
}
</script>
