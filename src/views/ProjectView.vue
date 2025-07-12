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
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const authorized = ref(false)

const projects = ref([])
const customers = ref([])
const loading = ref(false)
const searchTerm = ref('')

const dialogVisible = ref(false)
const isEditing = ref(false)
const currentProject = ref({ id: null, name: '', description: '', customerId: null })

onMounted(async () => {
  try {
    await axios.get('http://localhost:4000/api/auth/admin/dashboard', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt_token') },
    })
    authorized.value = true
    fetchProjects()
    fetchCustomers()
  } catch (error) {
    alert('Access denied: ' + (error.response?.data?.message || error.message))
    router.push('/login')
  }
})

const fetchProjects = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:4000/api/admin/project', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt_token') },
    })
    projects.value = res.data
  } catch {
    alert('Failed to fetch projects')
  } finally {
    loading.value = false
  }
}

const fetchCustomers = async () => {
  try {
    const res = await axios.get('http://localhost:4000/api/admin/customer', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt_token') },
    })
    customers.value = res.data
  } catch {
    alert('Failed to fetch customers')
  }
}

const filteredProjects = computed(() => {
  if (!searchTerm.value) return projects.value

  const term = searchTerm.value.toLowerCase()
  return projects.value.filter(
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
    if (isEditing.value) {
      await axios.put(
        `http://localhost:4000/api/admin/project/${currentProject.value.id}`,
        currentProject.value,
        { headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt_token') } },
      )
      alert('Project updated')
    } else {
      await axios.post('http://localhost:4000/api/admin/project', currentProject.value, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt_token') },
      })
      alert('Project created')
    }
    dialogVisible.value = false
    fetchProjects()
  } catch {
    alert('Failed to save project')
  }
}

const deleteProject = async (project) => {
  if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
    try {
      await axios.delete(`http://localhost:4000/api/admin/project/${project.id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt_token') },
      })
      alert('Project deleted')
      fetchProjects()
    } catch {
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
    v-if="authorized"
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4"
  >
    <Card class="w-full max-w-full sm:max-w-4xl md:max-w-5xl shadow-lg bg-white">
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
        <div class="mb-4 max-w-md">
          <InputText
            v-model="searchTerm"
            placeholder="Search projects by name, description or customer"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            clearable
          />
        </div>

        <DataTable
          :value="filteredProjects"
          :loading="loading"
          paginator
          rows="10"
          responsiveLayout="scroll"
          class="shadow rounded"
          :tableStyle="{ width: '100%' }"
        >
          <Column
            field="name"
            header="Project Name"
            sortable
            headerClass="bg-gray-100"
            class="px-4 py-2"
          />
          <Column
            field="description"
            header="Description"
            headerClass="bg-gray-100"
            class="px-4 py-2"
          />
          <Column
            field="customerName"
            header="Customer"
            headerClass="bg-gray-100"
            class="px-4 py-2"
          />

          <Column header="Actions" headerClass="bg-gray-100" class="px-4 py-2">
            <template #body="slotProps">
              <div class="flex space-x-2">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-sm p-button-outlined p-button-info"
                  @click="editProject(slotProps.data)"
                  aria-label="Edit"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-sm p-button-outlined p-button-danger"
                  @click="deleteProject(slotProps.data)"
                  aria-label="Delete"
                />
              </div>
            </template>
          </Column>
        </DataTable>

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
