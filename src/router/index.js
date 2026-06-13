import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import MealView from '@/views/MealView.vue'
import AdminHomeView from '@/views/AdminHomeView.vue'
import AdminFoodView from '@/views/AdminFoodView.vue'
import FoodSelectView from '@/views/FoodSelectView.vue'
import HistoryView from '@/views/HistoryView.vue'
import HistoryMonthView from '@/views/HistoryMonthView.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: LoginView,
    },
    {
      path: '/register',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      component: DashboardView,
    },
    {
      path: '/foods',
      component: FoodSelectView,
    },
    {
      path: '/history',
      component: HistoryView
    },
    {
      path: '/history/:month',
      component: HistoryMonthView
    },
    {
      path: '/meal',
      component: MealView
    },
     {
      path: '/admin',
      component: AdminHomeView
    },
    {
      path: '/admin/foods',
      component: AdminFoodView
    },
  ],
})

router.beforeEach(
  (to, from, next) => {

    const user =
      JSON.parse(
        localStorage.getItem(
          'user'
        )
      )

    if (
      !user &&
      to.path !== '/login' &&
      to.path !== '/register'
    ) {
      next('/login')
      return
    }

    next()
  }
)

export default router
