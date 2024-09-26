<script setup>
import { onMounted, ref, watch } from 'vue';

import { useAsst } from '@/stores/asst.store';

const asst = useAsst();

const contents = ref([]);

const detailsIndex = ref();

const onOpenHandler = index => {
  if (detailsIndex.value && detailsIndex.value === index) {
    detailsIndex.value = null;
  } else {
    detailsIndex.value = index;
  }
};

watch(
  contents,
  newValue => {
    asst.content = newValue;
  },
  { deep: true }
);

onMounted(async () => {
  contents.value = await asst.content;
});
</script>

<template>
  <p class="text-center">
    To describe the personality in the OpenAI Chat Completions system role, it is important to
    consider several key aspects that will help determine the tone and style of communication
  </p>

  <div class="space-y-4 max-h-96 w-full overflow-auto scrollbar-none p-4">
    <details
      class="group"
      v-for="(item, index) of contents"
      :key="index"
      :open="detailsIndex && detailsIndex === index"
    >
      <summary
        @click="onOpenHandler(index)"
        class="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
      >
        <h2 :class="['font-medium', { 'text-primary-500': item.content.length }]">
          {{ item.title }}
        </h2>

        <svg
          class="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>

      <textarea
        rows="3"
        v-model="item.content"
        :placeholder="`Enter ${item.title.toLocaleLowerCase()}`"
        class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md md:h-56 dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
      ></textarea>

      <p class="break-all text-gray-700">Details: {{ item.example }}</p>
    </details>
  </div>
</template>
