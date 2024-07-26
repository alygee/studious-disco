import { createRouter, createWebHistory } from 'vue-router';
import UserList from '../views/UserList.vue';
import UserDetail from '../views/UserDetail.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'user-list', component: UserList },
    {
      path: '/user/:id',
      name: 'UserDetail',
      component: UserDetail,
      props: true,
    },
  ],
});

export default router;
