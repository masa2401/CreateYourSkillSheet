import { createRouter, createWebHistory } from 'vue-router';
import TopPage from '@/views/TopPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'top',
      component: TopPage
    },
    {
      path: '/top',
      name: 'TopPage',
      component: TopPage
    },
    {
      path: '/survey',
      name: 'survey',
      component: () => import('@/views/SurveyPage.vue')
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('@/views/ResultPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue')
    }
  ],
})

export default router
