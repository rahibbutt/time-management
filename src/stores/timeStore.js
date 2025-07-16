import { defineStore } from 'pinia'
import axios from 'axios'

export const useTimeStore = defineStore('time', {
  state: () => ({
    timeBlocks: [],
    isTracking: false,
  }),

  getters: {
    // Total Tracked Time (All Time) in Seconds
    totalTrackedTime(state) {
      return Math.floor(
        state.timeBlocks.reduce((total, block) => {
          if (block.startTime && block.endTime) {
            const start = new Date(block.startTime)
            const end = new Date(block.endTime)
            const duration = (end - start) / 1000 // seconds
            return total + (duration > 0 ? duration : 0)
          }
          return total
        }, 0),
      )
    },

    // Total Tracked Time Today in Seconds
    totalTrackedTimeToday(state) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      return Math.floor(
        state.timeBlocks.reduce((total, block) => {
          if (block.startTime && block.endTime) {
            const start = new Date(block.startTime)
            const end = new Date(block.endTime)

            // Only blocks that overlap with today
            if (end >= today && start < tomorrow) {
              const duration = (end - start) / 1000 // seconds
              return total + (duration > 0 ? duration : 0)
            }
          }
          return total
        }, 0),
      )
    },
  },

  actions: {
    async loadTimeBlocks() {
      const token = localStorage.getItem('jwt_token')
      if (!token) throw new Error('No auth token')

      try {
        const response = await axios.get('http://localhost:4000/api/time', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.timeBlocks = response.data
        this.isTracking = this.timeBlocks.some((block) => !block.endTime)
      } catch (error) {
        console.error('Failed to load time blocks:', error)
        this.timeBlocks = []
        this.isTracking = false
      }
    },

    async startTracking({ projectId = null, taskDescription = null } = {}) {
      const token = localStorage.getItem('jwt_token')
      if (!token) throw new Error('No auth token')

      const now = new Date().toISOString()
      try {
        await axios.post(
          'http://localhost:4000/api/time',
          {
            startTime: now,
            endTime: null,
            project_id: projectId,
            task_description: taskDescription,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        this.isTracking = true
        await this.loadTimeBlocks()
      } catch (error) {
        console.error('Failed to start tracking:', error)
        throw error
      }
    },

    async stopTracking() {
      const token = localStorage.getItem('jwt_token')
      if (!token) throw new Error('No auth token')

      const now = new Date().toISOString()
      try {
        const activeBlock = this.timeBlocks.find((block) => !block.endTime)
        if (!activeBlock) throw new Error('No active time block found')

        await axios.put(
          `http://localhost:4000/api/time/${activeBlock.id}`,
          { endTime: now },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        this.isTracking = false
        await this.loadTimeBlocks()
      } catch (error) {
        console.error('Failed to stop tracking:', error)
        throw error
      }
    },
  },
})
