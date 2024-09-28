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
    asst.options = newValue;
  },
  { deep: true }
);

onMounted(async () => {
  contents.value = await asst.options;
});
</script>

<template>
  <div class="space-y-4 max-h-96 w-full overflow-y-auto p-4">
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
        class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
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
