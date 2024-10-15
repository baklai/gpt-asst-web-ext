<template>
  <div class="flex flex-col items-center justify-center text-center">
    <img src="/icons/icon-96.png" alt="logo" height="96" width="96" />

    <h1 class="text-2xl font-semibold uppercase text-primary-500 lg:text-3xl dark:text-white">
      {{ $t('ext.title') }}
    </h1>

    <p class="mt-4 max-w-[25rem] text-center text-xl text-gray-500 dark:text-gray-400">
      {{ $t('ext.description') }}
    </p>
  </div>
</template>
