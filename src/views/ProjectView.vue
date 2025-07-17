<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import 'primeicons/primeicons.css'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { useCustomerStore } from '@/stores/customerStore'
import { ProjectService } from '@/services/projectService.js'
import { useUserStore } from '@/stores/userStore.js'
import { isAdmin, isUserLoggedIn } from '@/helpers/user.helper.js'

const router = useRouter()
const projectStore = useProjectStore()
const customerStore = useCustomerStore()
const userStore = useUserStore()

const searchTerm = ref('')

const dialogVisible = ref(false)
const isEditing = ref(false)
const currentProject = ref({
  id: null,
  name: '',
  description: '',
  customerId: null,
})

onMounted(async () => {
  try {
    const user = userStore?.user

    if (!isUserLoggedIn(user)) {
      return router.push('/login')
    }

    if (!isAdmin(user)) {
      alert('Access denied: Admins only')
      return router.push('/profile')
    }

    await Promise.all([projectStore.loadProjects(), customerStore.loadCustomers()])
  } catch (error) {
    console.error('Error loading admin data:', error)
    alert('Error: ' + (error.response?.data?.message || error.message))
    // Optional: redirect if it's a 401
    if (error.response?.status === 401) {
      router.push('/login')
    }
  }
})

const customers = computed(() => customerStore.customers)

const filteredProjects = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return projectStore.projects.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term)) ||
      (p.customerName && p.customerName.toLowerCase().includes(term)),
  )
})

const openNew = () => {
  isEditing.value = false
  currentProject.value = { id: null, name: '', description: '', customerId: null }
  dialogVisible.value = true
}

const editProject = (project) => {
  isEditing.value = true
  currentProject.value = { ...project }
  dialogVisible.value = true
}

const saveProject = async () => {
  try {
    const project = currentProject.value

    if (isEditing.value) {
      const updatedProject = await ProjectService.update(project)
      // Use updatedProject returned from backend (with customerName updated)
      projectStore.updateProject(updatedProject.data)
      alert('Project updated')
    } else {
      const response = await ProjectService.create(project)
      projectStore.addProject(response.data)
      alert('Project created')
    }

    dialogVisible.value = false
  } catch (error) {
    console.error('Failed to save project:', error)
    alert('Failed to save project')
  }
}

const deleteProject = async (project) => {
  if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
    try {
      await ProjectService.remove(project.id)
      projectStore.deleteProject(project.id)
      alert('Project deleted')
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('Failed to delete project')
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('user_role')
  router.push('/login')
}
</script>

<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-x-hidden p-4"
  >
    <Card class="w-full max-w-full sm:max-w-4xl md:max-w-5xl shadow-lg bg-white overflow-visible">
      <template #title>
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 class="text-2xl font-semibold text-gray-800">Project Management</h2>
          <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2">
            <router-link to="/admin/dashboard">
              <Button
                label="Dashboard"
                icon="pi pi-home"
                class="p-button-sm p-button-secondary w-full sm:w-auto"
              />
            </router-link>
            <Button
              label="New Project"
              icon="pi pi-plus"
              class="p-button-sm w-full sm:w-auto"
              @click="openNew"
            />
            <Button
              label="Logout"
              severity="danger"
              icon="pi pi-sign-out"
              class="p-button-sm w-full sm:w-auto"
              @click="handleLogout"
            />
          </div>
        </div>
      </template>

      <template #content>
        <div class="mb-4 max-w-md w-full">
          <InputText
            v-model="searchTerm"
            placeholder="Search projects by name, description or customer"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            clearable
          />
        </div>

        <div class="w-full overflow-auto">
          <DataTable
            :value="filteredProjects"
            :loading="projectStore.loading"
            :totalRecords="filteredProjects.length"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50]"
            scrollable
            scrollHeight="flex"
            dataKey="id"
            class="min-w-[600px] shadow rounded"
          >
            <!-- Project Name -->
            <Column
              field="name"
              header="Project Name"
              sortable
              headerClass="bg-gray-100"
              class="break-words whitespace-normal max-w-[200px]"
            />

            <!-- Description -->
            <Column
              field="description"
              header="Description"
              headerClass="bg-gray-100"
              class="break-words whitespace-normal max-w-[300px]"
            />

            <!-- Customer Name -->
            <Column
              field="customerName"
              header="Customer"
              headerClass="bg-gray-100"
              class="break-words whitespace-normal max-w-[180px]"
            />

            <!-- Actions -->
            <Column header="Actions" headerClass="bg-gray-100" class="text-center">
              <template #body="{ data }">
                <div
                  class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 justify-center items-center"
                >
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-sm p-button-outlined p-button-info w-full sm:w-auto"
                    @click="editProject(data)"
                    aria-label="Edit"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="p-button-sm p-button-outlined p-button-danger w-full sm:w-auto"
                    @click="deleteProject(data)"
                    aria-label="Delete"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <Dialog
          header="Project Details"
          v-model:visible="dialogVisible"
          :modal="true"
          :closable="false"
          class="max-w-lg w-full p-6"
          content-class="bg-white rounded-lg shadow-lg"
        >
          <form @submit.prevent="saveProject" class="space-y-6">
            <div>
              <label for="name" class="block text-gray-700 font-semibold mb-1">Project Name</label>
              <InputText
                id="name"
                v-model="currentProject.name"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label for="description" class="block text-gray-700 font-semibold mb-1"
                >Description</label
              >
              <InputText
                id="description"
                v-model="currentProject.description"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label for="customer" class="block text-gray-700 font-semibold mb-1">Customer</label>
              <Dropdown
                id="customer"
                v-model="currentProject.customerId"
                :options="customers"
                optionLabel="name"
                optionValue="id"
                placeholder="Select a customer"
                class="w-full"
                required
              />
            </div>

            <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                label="Cancel"
                icon="pi pi-times"
                class="p-button-text w-full sm:w-auto"
                @click="dialogVisible = false"
                type="button"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                class="p-button-primary w-full sm:w-auto"
                type="submit"
              />
            </div>
          </form>
        </Dialog>
      </template>
    </Card>
  </div>
</template>
