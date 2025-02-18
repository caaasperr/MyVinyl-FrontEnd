import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';
import Profile from '@/views/Profile.vue';
import ShelfList from '@/views/ShelfList.vue';
import Shelf from '@/views/Shelf.vue';
import VinylList from '@/views/VinylList.vue';
import Main from '@/views/main.vue'
import axios from 'axios';
import { nextTick } from 'vue'

const routes = [
  { path: '/', component: Main, meta: { title: 'RecordBox - The Ultimate Vinyl Collection Manager' } },
  { path: '/login', component: Login, meta: { title: 'Login - RecordBox' } },
  { path: '/signup', component: Signup, meta: { title: 'Sign Up - RecordBox' }},
  { path: '/profile', component: Profile, meta: { requiresAuth: true },},
  { path: '/shelves', component: ShelfList, meta: { requiresAuth: true, title: 'Shelves - RecordBox' },},
  { path: '/shelf/:id', component: Shelf },
  { path: '/vinyl/', component: VinylList, meta: { requiresAuth: true, title: 'Vinyl - RecordBox' },},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      await axios.get('https://api.recordbox.org/api/v1/auth/session', { withCredentials: true });
      next();
    } catch (error) {
      next('/login');
    }
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  const title = to.meta.title === undefined ? 'RecordBox' : to.meta.title
  nextTick(() => {
    document.title = title
  })
})

export default router;
