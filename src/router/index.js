import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/main.vue';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';
import Profile from '@/views/Profile.vue';
import ShelfList from '@/views/ShelfList.vue';
import Shelf from '@/views/Shelf.vue';
import VinylList from '@/views/VinylList.vue';
import axios from 'axios';
import { nextTick } from 'vue';

const supportedLocales = ['ko', 'en'];

const routes = [
  {
    path: '/:locale(ko|en)?',
    component: { template: '<router-view />' },
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔒 인증을 위한 라우터 가드
router.beforeEach(async (to, from, next) => {
  const locale = to.params.locale || 'en';
  
  if (!supportedLocales.includes(locale)) {
    return next('/en');
  }

  if (to.meta.requiresAuth) {
    try {
      await axios.get('https://api.recordbox.org/api/v1/auth/session', { withCredentials: true });
      next();
    } catch (error) {
      next(`/${locale}/login`);
    }
  } else {
    next();
  }
});

// 📄 페이지 제목 설정
router.afterEach((to) => {
  nextTick(() => {
    document.title = to.meta.title || 'RecordBox';
  });
});

export default router;
