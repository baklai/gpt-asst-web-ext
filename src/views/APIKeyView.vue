<script setup>
import { ref } from 'vue';

import { useAsst } from '@/stores/asst.store';

const asst = useAsst();

const inputValue = ref(null);

const onSaveHandler = async () => {
  asst.apikey = inputValue.value;
};
</script>

<template>
  <div class="py-8 md:p-12 lg:p-8">
    <div class="mx-auto max-w-lg text-center">
      <h2 class="text-2xl font-bold text-gray-500 md:text-3xl">OpenAI API Key</h2>

      <p class="block mt-4 text-gray-500">
        <a href="https://platform.openai.com/api-keys" target="_blank" class="text-primary-500">
          {{ $t('apikey.description.link') }}
        </a>
        {{ $t('apikey.description.text') }}
      </p>
    </div>

    <div class="mx-auto mt-8 max-w-xl">
      <div class="sm:flex sm:gap-4">
        <div class="sm:flex-1">
          <label for="token" class="sr-only">OpenAI API Key</label>
          <input
            id="token"
            type="password"
            v-model="inputValue"
            :placeholder="$t('apikey.placeholder')"
            class="w-full p-3 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md shadow-sm dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>

        <button
          type="button"
          @click="onSaveHandler"
          class="group mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-400 shadow-sm px-5 py-3 text-white transition focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-50 sm:mt-0 sm:w-auto"
        >
          <span class="text-sm font-medium"> {{ $t('apikey.button') }} </span>
        </button>
      </div>
      <p class="mt-3 text-xs text-center text-gray-400 dark:text-gray-600">
        {{ $t('apikey.comment') }}
      </p>
    </div>
  </div>
</template>
