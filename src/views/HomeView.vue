<script setup>
import { onMounted, ref } from 'vue';

import { useAsst } from '@/stores/asst.store';

const asst = useAsst();

const BTN_TABS = ref([
  { title: 'Assistant for Telegram', url: 'https://web.telegram.org/a/' },
  { title: 'Assistant for WhatsApp', url: 'https://web.whatsapp.com/' }
]);

const content = ref(null);

const onResetHandler = () => {
  asst.apikey = null;
};

onMounted(async () => {
  const contents = await asst.content;

  content.value = contents
    .map(({ content }) => content)
    .join(' ')
    .trim();
});
</script>

<template>
  <div class="flex flex-col gap-y-6 w-full">
    <a
      v-for="item of BTN_TABS"
      :href="item.url"
      target="_blank"
      class="w-full px-6 py-3 text-sm font-medium text-center tracking-wide text-white transition-colors duration-300 transform bg-primary-500 rounded-md hover:bg-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-50"
    >
      {{ item.title }}
    </a>

    <div class="w-full" v-if="content">
      <p class="text-center pb-2">The personality described</p>
      <p class="whitespace-normal text-center text-gray-500 dark:text-gray-400">{{ content }}</p>
    </div>

    <button
      type="button"
      @click="onResetHandler"
      class="group mt-10 flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 hover:bg-orange-600 shadow-sm px-5 py-3 text-white transition focus:outline-none"
    >
      <span class="text-sm font-medium"> Reset API Key </span>
    </button>
  </div>
</template>
