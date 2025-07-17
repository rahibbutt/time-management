import { defineStore } from 'pinia'
import { ProjectService } from '@/services/projectService'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    loading: false,
  }),

  actions: {
    async loadProjects() {
      this.loading = true
      try {
        const res = await ProjectService.fetchAll()
        this.projects = res.data
      } catch (err) {
        console.error('Failed to load projects:', err)
      } finally {
        this.loading = false
      }
    },

    addProject(project) {
      this.projects.push(project)
    },

    updateProject(project) {
      const index = this.projects.findIndex((p) => p.id === project.id)
      if (index !== -1) {
        this.projects.splice(index, 1, project)
      }
    },

    deleteProject(id) {
      this.projects = this.projects.filter((p) => p.id !== id)
    },
  },
})
