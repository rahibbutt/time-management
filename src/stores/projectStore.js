import { defineStore } from 'pinia'
import axios from 'axios'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    loading: false,
  }),
  actions: {
    async loadProjects() {
      this.loading = true
      try {
        const token = localStorage.getItem('jwt_token')
        const res = await axios.get('http://localhost:4000/api/admin/project', {
          headers: { Authorization: `Bearer ${token}` },
        })
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
      if (index !== -1) this.projects[index] = project
    },

    deleteProject(id) {
      this.projects = this.projects.filter((p) => p.id !== id)
    },
  },
})
