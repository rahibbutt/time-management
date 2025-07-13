import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import RecordTime from '@/views/RecordTime.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import CustomerView from '@/views/CustomerView.vue'
import ProjectView from '@/views/ProjectView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/time',
      name: 'time',
      component: RecordTime,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: AdminDashboardView,
      meta: { requiresAdmin: true, adminOnly: true },
    },
    {
      path: '/admin/customer',
      name: 'customer',
      component: CustomerView,
      meta: { requiresAdmin: true, adminOnly: true },
    },
    {
      path: '/admin/project',
      name: 'project',
      component: ProjectView,
      meta: { requiresAdmin: true, adminOnly: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    // Prevent logged-in users from visiting login/register again
    next('/profile')
  } else {
    next()
  }
})

export default router
