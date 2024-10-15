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
  <main class="min-h-screen bg-white lg:flex dark:bg-gray-900">
    <header
      class="flex w-full flex-col justify-center p-8 lg:w-1/2 lg:bg-gray-100 lg:p-12 lg:dark:bg-gray-800"
    >
      <div class="m-auto flex flex-row items-start justify-center">
        <img
          src="/icons/icon-96.png"
          alt="logo"
          class="mr-4 hidden items-start lg:flex"
          height="96"
          width="96"
        />

        <div class="flex flex-col items-center justify-center lg:items-start">
          <div class="flex">
            <img
              src="/icons/icon-32.png"
              alt="logo"
              class="mr-2 flex items-start lg:hidden"
              height="32"
              width="32"
            />
            <h1
              class="text-2xl font-semibold uppercase text-primary-500 lg:text-3xl dark:text-white"
            >
              {{ $t('ext.title') }}
            </h1>
          </div>

          <p class="mt-4 max-w-[25rem] text-center text-gray-500 lg:text-start dark:text-gray-400">
            {{ $t('ext.description') }}
          </p>

          <nav class="flex flex-wrap justify-around gap-4 py-4 lg:justify-start">
            <RouterLink
              v-for="link of NAV_LIKS"
              :to="{ name: link.name }"
              class="transform font-bold uppercase text-gray-400 transition-colors duration-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              {{ link.title }}
            </RouterLink>
          </nav>

          <div class="mt-6 hidden flex-wrap gap-4 py-4 md:mt-8 lg:block">
            <div class="mt-4 flex gap-4">
              <a
                class="mx-1.5 transform text-gray-400 transition-colors duration-300 hover:text-primary-500 dark:hover:text-primary-400"
                target="_blank"
                :href="item.href"
                v-for="item of FOLLOW_LINKS"
              >
                <component :is="item.icon" class="h-6 w-6"></component>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section
      class="m-auto flex max-w-[30rem] flex-col items-center justify-center px-8 lg:w-1/2 lg:px-12"
    >
      <RouterView />
    </section>
  </main>
</template>
