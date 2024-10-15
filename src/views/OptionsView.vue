<script setup>
import { onMounted, ref, watch } from 'vue';

import { useAsst } from '@/stores/asst.store';

const asst = useAsst();

const contents = ref([]);

watch(
  contents,
  newValue => {
    asst.options = newValue;
  },
  { deep: true }
);

onMounted(async () => {
  contents.value = await asst.options;
});
</script>

<template>
  <div class="max-h-96 w-full space-y-4 overflow-y-auto p-4">
    <details class="group" v-for="(item, index) of contents" :key="index">
      <summary
        name="option-item"
        class="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
      >
        <h2 :class="['font-medium', { 'text-primary-500': item.content.length }]">
          {{ $t(item.title) }}
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
        :placeholder="$t(item.title)"
        class="mt-2 block w-full rounded-md border border-gray-200 bg-white px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-600 dark:focus:border-blue-400"
      ></textarea>

      <small class="break-all text-gray-700">{{ $t('Details') }} : {{ $t(item.example) }}</small>
    </details>
  </div>

  <div class="w-full p-4 text-gray-500 dark:text-gray-400">
    <p class="text-center">
      {{ $t('options.description') }}
    </p>
  </div>
</template>
