import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/views/HomeView.vue';

import { useAsst } from '@/stores/asst.store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: 'GPT Assistant',
        description: 'GPT Assistant'
      },
      component: HomePage
    },

    {
      path: '/about',
      name: 'about',
      meta: {
        title: 'GPT Assistant about',
        description: 'GPT Assistant about'
      },
      component: () => import('@/views/AboutView.vue')
    },

    {
      path: '/apikey',
      name: 'apikey',
      meta: {
        title: 'GPT Assistant API Key',
        description: 'GPT Assistant API Key'
      },
      component: () => import('@/views/APIKeyView.vue')
    },

    {
      path: '/options',
      name: 'options',
      meta: {
        title: 'GPT Assistant options',
        description: 'GPT Assistant options'
      },
      component: () => import('@/views/OptionsView.vue')
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'home' },
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
});

router.beforeEach((to, from) => {
  const title = to?.meta?.title;
  if (title) {
    document.title = `ASST • ${title}`;
  } else {
    document.title = `ASST • GPT Assistant`;
  }

  const description = to.meta.description;
  if (description) {
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute('content', description);
    }
  }

  return;
});

router.beforeEach(async (to, from) => {
  const store = useAsst();

  const isApikey = await store.apikey;

  if (!isApikey && to.name === 'home') {
    return { name: 'apikey' };
  } else {
    return;
  }
});

export default router;
