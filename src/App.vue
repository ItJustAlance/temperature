<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="over">
    <header>
      <img
        alt="Vue logo"
        class="logo"
        src="@/assets/logo.svg"
        width="125"
        height="125"
      />

      <div class="wrapper">
        <HelloWorld msg="You did it!" />

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/login">login</RouterLink>
          <RouterLink to="/register">register</RouterLink>
          <RouterLink to="/weather">weather</RouterLink>
        </nav>
      </div>
    </header>
    <RouterView />
  </div>



</template>

<style scoped>

</style>
