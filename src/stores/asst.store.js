import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';

import { systems, useChromeStorageLocal } from '@/service/asst.service';

export const useAsst = defineStore('asst', () => {
  const router = useRouter();

  const apikey = useChromeStorageLocal('asst-apikey', null);
  const options = useChromeStorageLocal('asst-options', systems);

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
    options
  };
});
