import { defineStore } from 'pinia'
import axios from 'axios'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    loading: false,
  }),
  actions: {
    async checkAuthorization() {
      try {
        const token = localStorage.getItem('jwt_token')
        await axios.get('http://localhost:4000/api/auth/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        })
        return true
      } catch (err) {
        console.error('Authorization failed:', err)
        throw err
      }
    },

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

    async addProject(project) {
      try {
        const token = localStorage.getItem('jwt_token')
        const res = await axios.post('http://localhost:4000/api/admin/project', project, {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.projects.push(res.data)
      } catch (err) {
        console.error('Failed to add project:', err)
      }
    },

    async updateProject(project) {
      try {
        const token = localStorage.getItem('jwt_token')
        await axios.put(`http://localhost:4000/api/admin/project/${project.id}`, project, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const index = this.projects.findIndex((p) => p.id === project.id)
        if (index !== -1) this.projects[index] = project
      } catch (err) {
        console.error('Failed to update project:', err)
      }
    },

    async deleteProject(id) {
      try {
        const token = localStorage.getItem('jwt_token')
        await axios.delete(`http://localhost:4000/api/admin/project/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.projects = this.projects.filter((p) => p.id !== id)
      } catch (err) {
        console.error('Failed to delete project:', err)
      }
    },
  },
})
