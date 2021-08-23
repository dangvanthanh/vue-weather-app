<template>
  <div class="card">
    <div class="card-info">
      <p>{{ title }}</p>
      <h2>{{ metric }}</h2>
      <p>{{ unit }}</p>
    </div>
    <div class="card-icon">
      <img :src="icon" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  metric: [String, Number],
  unit: String,
  icon: String,
})
</script>

<style scoped>
.card {
  border: 1px solid #afb9de;
  border-radius: 0.25rem;
  background: #fff;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.card-info {
  flex: 1 1 0%;
}

.card-info h2 {
  font-size: 1.5rem;
}

.card-icon {
  width: 5rem;
}
</style>