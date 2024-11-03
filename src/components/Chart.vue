<template>
  <div>
    <div class="controls">
      <button @click="toggleTheme">{{ currentTheme }} Mode</button>
      <select v-model="chartType">
        <option value="line">Line Chart</option>
        <option value="bar">Bar Chart</option>
      </select>
      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
    </div>

    <h3>Обычный</h3>
    <ChartComp :update="isUpdate" :chartType="chartType" :chartData="filteredChartData" :chartOptions="chartOptions" />

    <h3>скользящая</h3>
    <ChartComp :update="isUpdate" :chartType="chartType" :chartData="filteredChartDataWithMA" :chartOptions="chartOptions" />

    <h3>комбинированный</h3>
    <ChartComp :update="isUpdate" :chartType="chartType" :chartData="filteredCombinedData" :chartOptions="combinedChartOptions" />

  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import ChartComp from '@/components/charts/ChartComp.vue';



    const currentTheme = ref('Light');
    const chartType = ref('line');
    const startDate = ref('');
    const endDate = ref('');
    const barColor = ref('#000');
    const isUpdate = ref(false);

    // Данные температуры
    const temperatureData = ref({
      labels: [
        '2024-10-01',
        '2024-10-02',
        '2024-10-03',
        '2024-10-04',
        '2024-10-05',
        '2024-10-06',
        '2024-10-07',
        '2024-10-08',
        '2024-10-09',
        '2024-10-10'
      ],
      datasets: [
        {
          label: 'Temperature',
          data: [18, 26, 14, 22, 12, 20, 12, 18, 10],
          borderColor: barColor,
          backgroundColor: barColor
        }
      ]
    });


    // Данные для комбинированного графика
    const combinedData = ref({
      labels: temperatureData.value.labels,
      datasets: [
        {
          label: 'Temperature',
          data: [18, 26, 14, 22, 12, 20, 12, 18, 10],
          yAxisID: 'left-y-axis',
          borderColor: barColor,
          backgroundColor: 'rgba(255, 99, 132, 0.2)'
        },
        {
          label: 'Humidity',
          data: [15, 27, 14, 52, 22, 40, 32, 88, 40],
          yAxisID: 'right-y-axis',
          borderColor: '#36a2eb',
          backgroundColor: 'rgba(54, 162, 235, 0.2)'
        }
      ]
    });

    // Функция для расчета скользящей средней
    const calculateMovingAverage = (data, windowSize) => {
      const movingAverage = [];
      for (let i = 0; i < data.length; i++) {
        if (i < windowSize - 1) {
          movingAverage.push(null);
        } else {
          const window = data.slice(i - windowSize + 1, i + 1);
          const average = window.reduce((sum, val) => sum + val, 0) / windowSize;
          movingAverage.push(average);
        }
      }
      return movingAverage;
    };

    // Данные для скользящей средней
    const movingAverageData = computed(() => calculateMovingAverage(temperatureData.value.datasets[0].data, 3));

    // Реактивные данные для фильтрации
    const filteredChartData = ref({ ...temperatureData.value });
    const filteredCombinedData = ref({ ...combinedData.value });

    // Данные для второго графика с температурой и скользящей средней
    const filteredChartDataWithMA = ref({
      ...temperatureData.value,
      datasets: [
        ...temperatureData.value.datasets,
        {
          label: 'Moving Average',
          data: movingAverageData.value,
          borderColor: 'blue',
          borderDash: [5, 5]
        }
      ]
    });

    // Опции графика
    const chartOptions = ref({
      responsive: true,
      plugins: {
        legend: { position: 'top', labels: { color: '#000' } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#333' } },
        x: { ticks: { color: '#333' } }
      }
    });

    const combinedChartOptions = ref({
      responsive: true,
      plugins: {
        legend: { position: 'top', labels: { color: "#000" } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        'left-y-axis': {
          type: 'linear',
          position: 'left'
        },
        'right-y-axis': {
          type: 'linear',
          position: 'right'
        }
      }
    });

    // Темная и светлая темы
    const toggleTheme = () => {
      currentTheme.value = currentTheme.value === 'Light' ? 'Dark' : 'Light';
      const color = currentTheme.value === 'Light' ? '#000' : '#c0c0c0';

      chartOptions.value.plugins.legend.labels.color = color;
      chartOptions.value.scales.y.ticks.color = color;
      chartOptions.value.scales.x.ticks.color = color;

      barColor.value = color;

      isUpdate.value = !isUpdate.value;
    };

    // Обновление данных для фильтрации по датам
    const updateFilteredChartData = () => {
      if (!startDate.value || !endDate.value) {
        filteredChartData.value = { ...temperatureData.value };
        filteredChartDataWithMA.value = { ...temperatureData.value, datasets: [...temperatureData.value.datasets, {
            label: 'Moving Average',
            data: movingAverageData.value,
            borderColor: 'blue',
            borderDash: [5, 5]
          }] };
        combinedData.value = { ...combinedData.value }; // если комбинированные данные такие же, они тоже сохранятся

        return;
      }

      const start = new Date(startDate.value);
      const end = new Date(endDate.value);

      const filteredLabels = [];
      const filteredData = [];
      const filteredMovingAverage = [];
      const filteredHumidityData1 = [];
      const filteredHumidityData2 = [];

      temperatureData.value.labels.forEach((label, index) => {
        const date = new Date(label);
        if (date >= start && date <= end) {
          filteredLabels.push(label);
          filteredData.push(temperatureData.value.datasets[0].data[index]);
          filteredMovingAverage.push(movingAverageData.value[index]);
          filteredHumidityData1.push(combinedData.value.datasets[0].data[index]); // Отфильтруем данные влажности для combinedData
          filteredHumidityData2.push(combinedData.value.datasets[1].data[index]); // Отфильтруем данные влажности для combinedData
        }
      });

      // Обновление данных `filteredChartData`
      filteredChartData.value = {
        labels: filteredLabels,
        datasets: [
          { ...temperatureData.value.datasets[0], data: filteredData }
        ]
      };

      // Обновление данных `filteredChartDataWithMA`
      filteredChartDataWithMA.value = {
        labels: filteredLabels,
        datasets: [
          { ...temperatureData.value.datasets[0], data: filteredData },
          {
            label: 'Moving Average',
            data: filteredMovingAverage,
            borderColor: 'blue',
            borderDash: [5, 5]
          }
        ]
      };

      // Обновление данных `combinedData`
      filteredCombinedData.value = {
        labels: filteredLabels,
        datasets: [
          { ...combinedData.value.datasets[0], data: filteredHumidityData1 },
          { ...combinedData.value.datasets[1], data: filteredHumidityData2 }
        ]
      };

      isUpdate.value = !isUpdate.value;
    };


    // Наблюдение за изменениями дат
    watch([startDate, endDate], () => {
      updateFilteredChartData();
    });

</script>

<style scoped>
.controls {
  margin-bottom: 20px;
}
</style>
