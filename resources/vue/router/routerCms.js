import { createWebHistory, createRouter } from 'vue-router';
import PrintTest from '@/views/pages/cms/PrintTest.vue';

const routes = [
  {
    path: '/cms',
    name: 'home',
    component: PrintTest,
  },
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router
