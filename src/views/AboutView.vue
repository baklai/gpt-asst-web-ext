<template>
  <div class="flex flex-col justify-center items-center text-center">
    <img src="/icons/icon-96.png" alt="logo" height="96" width="96" />

    <h1 class="text-2xl font-semibold uppercase text-primary-500 dark:text-white lg:text-3xl">
      {{ $t('ext.title') }}
    </h1>

    <p class="text-center text-xl mt-4 max-w-[25rem] text-gray-500 dark:text-gray-400">
      {{ $t('ext.description') }}
    </p>
  </div>
</template>
