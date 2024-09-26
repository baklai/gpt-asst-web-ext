import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';

import { contents, useChromeStorageLocal } from '@/service/asst.service';

export const useAsst = defineStore('asst', () => {
  const router = useRouter();

  const apikey = useChromeStorageLocal('asst-apikey', null);
  const content = useChromeStorageLocal('asst-content', contents);

  watch(apikey, async newValue => {
    const aValue = await newValue;

    if (!aValue) {
      router.push({ name: 'apikey' });
    } else {
      router.push({ name: 'home' });
    }
  });

  return {
    apikey,
    content
  };
});
