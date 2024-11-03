import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
    { path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
    },
    {
      path: '/weather',
      name: 'Weather',
      component: () => import('@/views/Weather.vue'),
      meta: { requiresAuth: true } // Защита страницы
    },
    {
      path: '/lock',
      name: 'Lock',
      component: () => import('@/views/403.vue')
    },
    { path: '/', redirect: '/login' },



  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken')
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Lock'})
  }
  next()
})

export default router;
