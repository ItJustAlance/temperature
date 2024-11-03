<script setup lang="ts">
import { useRouter } from "vue-router";
import Chart from "@/components/Chart.vue";


const router = useRouter();

const logout = () => {
  localStorage.removeItem('authToken')
  router.push('/')
}
</script>

<template>
  <main><br><br><br><br>
    <h1>weather</h1>
    <br><br>
    <Chart/><br><br>
    <button @click="logout">Выйти</button>
    <br><br>
  </main>
</template>
