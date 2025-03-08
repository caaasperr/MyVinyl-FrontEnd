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
<<<<<<< HEAD
  {
    path: '/:locale(ko|en)?',
    component: { template: '<router-view />' },
    beforeEnter: (to, from, next) => {
      const locale = to.params.locale || 'en';
      if (!supportedLocales.includes(locale)) {
        return next('/en');
      }
      next();
    },
    children: [
      { path: '', name: 'home', component: Home, meta: { title: 'RecordBox' } },
      { path: 'login', name: 'login', component: Login, meta: { title: 'Login - RecordBox' } },
      { path: 'signup', name: 'signup', component: Signup, meta: { title: 'Sign Up - RecordBox' } },
      { path: 'profile', name: 'profile', component: Profile, meta: { requiresAuth: true, title: 'Profile - RecordBox' } },
      { path: 'shelves', name: 'shelves', component: ShelfList, meta: { requiresAuth: true, title: 'Shelves - RecordBox' } },
      { path: 'shelf/:id', name: 'shelf', component: Shelf, meta: { requiresAuth: true, title: 'Shelf Details - RecordBox' } },
      { path: 'vinyl', name: 'vinyl', component: VinylList, meta: { requiresAuth: true, title: 'Vinyl - RecordBox' } },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/en' },
=======
  { path: '/', component: Main, meta: { title: 'RecordBox - The Ultimate Vinyl Collection Manager' } },
  { path: '/login', component: Login, meta: { title: 'Login - RecordBox' } },
  { path: '/signup', component: Signup, meta: { title: 'Sign Up - RecordBox' }},
  { path: '/profile', component: Profile, meta: { requiresAuth: true },},
  { path: '/shelves', component: ShelfList, meta: { requiresAuth: true, title: 'Shelves - RecordBox' },},
  { path: '/shelf/:id', component: Shelf },
  { path: '/vinyl/', component: VinylList, meta: { requiresAuth: true, title: 'Vinyl - RecordBox' },},
>>>>>>> parent of b9fc7a1 (Update index.js)
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

<<<<<<< HEAD
// 🔒 인증 가드
=======
>>>>>>> parent of b9fc7a1 (Update index.js)
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      await axios.get('https://api.recordbox.org/api/v1/auth/session', { withCredentials: true });
      next();
    } catch (error) {
<<<<<<< HEAD
      next(`/login`);
=======
      next('/login');
>>>>>>> parent of b9fc7a1 (Update index.js)
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  const title = to.meta.title === undefined ? 'RecordBox' : to.meta.title
  nextTick(() => {
    document.title = title
  })
})

export default router;
