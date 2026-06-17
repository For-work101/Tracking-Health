<template>
  <div class="app-bg">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
html,
body,
#app {
  margin: 0;
  min-height: 100vh;
}

.app-bg {
  min-height: 100vh;

  background: linear-gradient(
  to top,
  #66bb6a 0%,
  #81c784 25%,
  #a5d6a7 50%,
  #c8e6c9 75%,
  #f1f8e9 100%
);
}
</style>