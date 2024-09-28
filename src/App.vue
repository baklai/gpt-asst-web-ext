<script setup>
import { useI18n } from 'vue-i18n';

import IconFacebook from '@/components/icons/IconFacebook.vue';
import IconGithub from '@/components/icons/IconGithub.vue';
import IconInstagram from '@/components/icons/IconInstagram.vue';
import IconLinkedin from '@/components/icons/IconLinkedin.vue';

const { t } = useI18n();

const NAV_LIKS = [
  { name: 'home', title: t('nav.home') },
  { name: 'options', title: t('nav.options') },
  { name: 'about', title: t('nav.about') }
];

const FOLLOW_LINKS = [
  { icon: IconGithub, title: 'github', href: 'https://github.com/baklai' },
  { icon: IconLinkedin, title: 'linkedin', href: 'https://www.linkedin.com/in/baklai/' },
  { icon: IconFacebook, title: 'facebook', href: 'https://www.facebook.com/dmitrii.baklai' },
  { icon: IconInstagram, title: 'instagram', href: 'https://www.instagram.com/baklai.di/' }
];
</script>

<template>
  <main class="min-h-screen bg-white dark:bg-gray-900 lg:flex">
    <header
      class="flex flex-col justify-center w-full p-8 lg:bg-gray-100 lg:dark:bg-gray-800 lg:p-12 lg:w-1/2"
    >
      <div class="flex flex-row items-start justify-center m-auto">
        <img
          src="/icons/icon-96.png"
          alt="logo"
          class="hidden lg:flex items-start mr-4"
          height="96"
          width="96"
        />

        <div class="flex flex-col items-center justify-center lg:items-start">
          <div class="flex">
            <img
              src="/icons/icon-32.png"
              alt="logo"
              class="flex items-start mr-2 lg:hidden"
              height="32"
              width="32"
            />
            <h1
              class="text-2xl font-semibold uppercase text-primary-500 dark:text-white lg:text-3xl"
            >
              {{ $t('ext.title') }}
            </h1>
          </div>

          <p class="text-center lg:text-start mt-4 max-w-[25rem] text-gray-500 dark:text-gray-400">
            {{ $t('ext.description') }}
          </p>

          <nav class="flex flex-wrap justify-around lg:justify-start gap-4 py-4">
            <RouterLink
              v-for="link of NAV_LIKS"
              :to="{ name: link.name }"
              class="font-bold uppercase dark:hover:text-primary-400 text-gray-400 transition-colors duration-300 transform hover:text-primary-500"
            >
              {{ link.title }}
            </RouterLink>
          </nav>

          <div class="mt-6 md:mt-8 hidden lg:block flex-wrap gap-4 py-4">
            <div class="flex gap-4 mt-4">
              <a
                class="mx-1.5 dark:hover:text-primary-400 text-gray-400 transition-colors duration-300 transform hover:text-primary-500"
                target="_blank"
                :href="item.href"
                v-for="item of FOLLOW_LINKS"
              >
                <component :is="item.icon" class="w-6 h-6"></component>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section
      class="flex flex-col justify-center items-center m-auto max-w-[30rem] px-8 lg:w-1/2 lg:px-12"
    >
      <RouterView />
    </section>
  </main>
</template>
