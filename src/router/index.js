import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';
import Profile from '@/views/Profile.vue';
import ShelfList from '@/views/ShelfList.vue';
import Shelf from '@/views/Shelf.vue';
import VinylList from '@/views/VinylList.vue';
import Main from '@/views/main.vue'
import axios from 'axios';

const routes = [
  { path: '/', component: Main },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/profile', component: Profile, meta: { requiresAuth: true },},
  { path: '/shelves', component: ShelfList, meta: { requiresAuth: true },},
  { path: '/shelf/:id', component: Shelf },
  { path: '/vinyls/', component: VinylList, meta: { requiresAuth: true },},
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      await axios.get('http://192.168.0.15:8080/api/v1/auth/session', { withCredentials: true });
      next();
    } catch (error) {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
