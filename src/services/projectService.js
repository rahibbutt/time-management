import { HttpServiceInstance } from '@/utils/HttpService.js'

export const ProjectService = {
  async fetchAll() {
    return await HttpServiceInstance.get('/api/admin/project')
  },

  async create(project) {
    return await HttpServiceInstance.post('/api/admin/project', project)
  },

  async update(project) {
    return await HttpServiceInstance.put(`/api/admin/project/${project.id}`, project)
  },

  async remove(id) {
    return await HttpServiceInstance.delete(`/api/admin/project/${id}`)
  },
}
