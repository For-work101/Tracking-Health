<template>
  <div class="container">
    <h1>Admin Page</h1>

    <button @click="$router.push('/admin/foods')" style="cursor: pointer; background-color: #3498db; color: white;">
      🍽️ จัดการอาหาร
    </button>

    <button @click="logout" style="cursor: pointer; background-color: #e74c3c; color: white;">
      🚪 ออกจากระบบ
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}

button {
  width: 100%;
  margin-top: 12px;
  padding: 16px;
  border: none;
  border-radius: 12px;
}
</style>