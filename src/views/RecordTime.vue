<script setup>
import { computed, onMounted, watch } from 'vue'
import { useTimeStore } from '@/stores/timeStore'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useTimeStore()

// Format duration for text display
const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hrs}h ${mins}m ${secs}s`
}

// Back button
const goBack = () => {
  router.push('/profile')
}

onMounted(async () => {
  await store.loadTimeBlocks() // Load from localStorage or backend
})

// Today's Time Blocks (auto-updates)
const todayBlocks = computed(() => {
  const todayDate = new Date().toISOString().slice(0, 10)
  return store.timeBlocks.filter(
    (block) => new Date(block.startTime).toISOString().slice(0, 10) === todayDate,
  )
})

// Chart Data: Duration per block in minutes
const chartData = computed(() => {
  const labels = todayBlocks.value.map((block, idx) => `Block ${idx + 1}`)
  const durations = todayBlocks.value.map((block) => {
    const start = new Date(block.startTime)
    const end = block.endTime ? new Date(block.endTime) : new Date()
    const duration = (end - start) / 60000 // Minutes
    return Math.max(duration, 0)
  })

  return {
    labels,
    datasets: [
      {
        label: 'Minutes Worked',
        backgroundColor: '#6366f1',
        data: durations,
      },
    ],
  }
})

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          const rawMinutes = Number(context.raw) || 0
          const totalSeconds = Math.floor(rawMinutes * 60)

          const hours = Math.floor(totalSeconds / 3600)
          const minutes = Math.floor((totalSeconds % 3600) / 60)
          const seconds = totalSeconds % 60

          return `Time: ${hours}h ${minutes}m ${seconds}s`
        },
      },
    },
  },
}

// Optional: Watch for debugging
watch(
  () => store.timeBlocks,
  () => {
    console.log('Time blocks updated:', store.timeBlocks)
  },
  { deep: true },
)
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 space-y-8"
  >
    <Card class="w-full max-w-4xl shadow-lg p-4">
      <template #title>
        <div class="text-center text-2xl font-semibold text-gray-800">Time Management</div>
      </template>
      <template #content>
        <div class="flex flex-col items-center space-y-6">
          <Button
            :label="store.isTracking ? 'Stop time tracking' : 'Start time tracking'"
            @click="store.isTracking ? store.stopTracking() : store.startTracking()"
            :class="store.isTracking ? 'p-button-danger' : 'p-button-success'"
            class="w-full"
          />

          <div class="w-full">
            <!-- Bar Chart -->
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Today's Time Blocks:</h3>

            <div v-if="todayBlocks.length > 0" class="h-72">
              <div class="relative w-full h-full">
                <Chart
                  type="bar"
                  :data="chartData"
                  :options="chartOptions"
                  style="width: 100%; height: 100%"
                />
              </div>
            </div>
            <div v-else class="text-gray-700 text-center mt-4">No time blocks recorded today.</div>

            <!-- Totals -->
            <div class="mt-2 text-gray-900 font-bold">
              Total time tracked today: {{ formatDuration(store.totalTrackedTimeToday) }}
            </div>
            <div class="mt-2 text-gray-900 font-bold">
              Total time tracked since the beginning: {{ formatDuration(store.totalTrackedTime) }}
            </div>
          </div>
        </div>

        <!-- Back Button -->
        <Button
          label="Back to Profile"
          class="w-full mt-10 bg-indigo-600 border-none hover:bg-indigo-700"
          @click="goBack"
        />
      </template>
    </Card>
  </div>
</template>
