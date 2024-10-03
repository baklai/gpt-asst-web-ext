<script setup>
import { onMounted, ref } from 'vue';

import { useAsst } from '@/stores/asst.store';

const asst = useAsst();

const BTN_TABS = ref([{ title: 'Telegram Web', url: 'https://web.telegram.org/a/' }]);

const content = ref(null);

const onResetHandler = () => {
  asst.apikey = null;
};

onMounted(async () => {
  const contents = await asst.options;

  content.value = contents
    .map(({ content }) => content)
    .join(' ')
    .trim();
});
</script>

<template>
  <div class="flex flex-col w-full mb-6">
    <details class="group py-2">
      <summary class="flex cursor-pointer items-center text-gray-500 dark:text-gray-400">
        <span class="h-px flex-1 bg-gray-300"></span>
        <span class="shrink-0 px-6 uppercase font-medium hover:text-primary-400">
          {{ $t('home.apikey.text') }}
        </span>
        <span class="h-px flex-1 bg-gray-300"></span>
      </summary>
      <button
        type="button"
        @click="onResetHandler"
        class="group my-4 flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 hover:bg-orange-600 shadow-sm px-5 py-3 text-white transition focus:outline-none"
      >
        <span class="text-sm font-medium"> {{ $t('home.apikey.button') }} </span>
      </button>
    </details>
  </div>

  <div class="flex flex-col gap-y-6 w-full">
    <a
      v-for="item of BTN_TABS"
      :href="item.url"
      target="_blank"
      class="w-full px-6 py-3 text-sm font-medium text-center tracking-wide text-white transition-colors duration-300 transform bg-primary-500 rounded-md hover:bg-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-50"
    >
      {{ item.title }}
    </a>

    <div class="flex flex-col gap-y-6 w-full">
      <details class="group py-2">
        <summary class="flex cursor-pointer items-center text-gray-500 dark:text-gray-400">
          <span class="h-px flex-1 bg-gray-300"></span>
          <span class="shrink-0 px-6 uppercase font-medium hover:text-primary-400">
            {{ $t('home.options.text') }}
          </span>
          <span class="h-px flex-1 bg-gray-300"></span>
        </summary>

        <p
          class="my-4 whitespace-normal leading-relaxed break-all text-center text-gray-500 dark:text-gray-400"
          v-if="content"
        >
          {{ content }}
        </p>
        <button
          type="button"
          @click="$router.push({ name: 'options' })"
          class="w-full my-4 px-6 py-3 text-sm font-medium text-center tracking-wide text-white transition-colors duration-300 transform bg-primary-500 rounded-md hover:bg-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-50"
        >
          {{ $t('home.options.button') }}
        </button>
      </details>
    </div>
  </div>
</template>
