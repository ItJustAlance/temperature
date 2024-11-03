<script setup>
import { onMounted, onUpdated, onUnmounted, ref, watch, defineProps } from 'vue';
import { Chart } from 'chart.js/auto';

// Определение пропсов
const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    required: true
  },
  chartType: {
    type: String,
    default: 'line'
  },
  isUpdate: {
    type: Boolean,
    default: false
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

// Инициализация графика
const initializeChart = () => {
  chartInstance = new Chart(chartCanvas.value, {
    type: props.chartType,
    data: props.chartData,
    options: props.chartOptions
  });
};

// Обновление данных и параметров графика
const updateChart = () => {
  if (chartInstance) {
    chartInstance.data = props.chartData;
    chartInstance.options = props.chartOptions;
    chartInstance.update();
  }
};

// Пересоздание графика
const recreateChart = () => {
  if (chartInstance) {
    chartInstance.destroy(); // Удаляем старый экземпляр графика
  }
  initializeChart(); // Создаем новый график
};

onMounted(() => {
  initializeChart();
});

onUpdated(() => {
  if (chartInstance) {
    // Если тип графика изменился, пересоздаем график
    if (chartInstance.config.type !== props.chartType) {
      recreateChart();
    } else {
      updateChart(); // Обновляем данные, если тип и опции не изменились
    }
  }
});

// Обработка изменения isUpdate
watch(() => props.isUpdate, (newVal) => {
  if (newVal) {
    recreateChart(); // Пересоздаем график, если isUpdate изменился
  }
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
