<script setup>
import { onMounted } from 'vue'
import { useTimeStore } from '@/stores/timeStore'
import Button from 'primevue/button'
import Card from 'primevue/card'

const store = useTimeStore()

onMounted(() => {
  store.loadTimeBlocks()
})

// Utility function for formatting time
function formatDuration(ms) {
  if (!ms || isNaN(ms)) return '0h 0m 0s'

  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours}h ${minutes}m ${seconds}s`
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 space-y-8"
  >
    <Card class="w-full max-w-lg shadow-lg">
      <template #title>
        <div class="text-center text-2xl font-semibold text-gray-800">Time Management</div>
      </template>
      <template #content>
        <div class="flex flex-col items-center space-y-4">
          <Button
            :label="store.isTracking ? 'Stop Working Time' : 'Start Working Time'"
            @click="store.isTracking ? store.stopTracking() : store.startTracking()"
            class="w-full"
          />
          <div class="w-full">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Time Blocks Today:</h3>
            <ul class="space-y-2">
              <li
                v-for="(block, index) in store.timeBlocks"
                :key="block.id || index"
                class="text-gray-800"
              >
                {{ new Date(block.startTime).toLocaleTimeString() }} →
                {{ block.endTime ? new Date(block.endTime).toLocaleTimeString() : 'In progress' }}
              </li>
            </ul>
            <div class="mt-4 text-gray-900 font-bold">
              Total Time Tracked: {{ formatDuration(store.totalTrackedTime) }}
            </div>
            <div class="mt-4 text-gray-900 font-bold">
              Total Time Tracked Today: {{ formatDuration(store.totalTrackedTimeToday) }}
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
