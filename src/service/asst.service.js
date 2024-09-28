import { customRef } from 'vue';

export const systems = [
  {
    title: 'options.first.title',
    content: '',
    example: 'options.first.example'
  },
  {
    title: 'options.second.title',
    content: '',
    example: 'options.second.example'
  },
  {
    title: 'options.third.title',
    content: '',
    example: 'options.third.example'
  },
  {
    title: 'options.fourth.title',
    content: '',
    example: 'options.fourth.example'
  },
  {
    title: 'options.fifth.title',
    content: '',
    example: 'options.fifth.example'
  }
];

export function useChromeStorageLocal(key, defaultValue) {
  return customRef((track, trigger) => ({
    get: async () => {
      track();
      try {
        const result = await chrome.storage.local.get([key]);
        return result[key] !== undefined ? result[key] : defaultValue;
      } catch (error) {
        console.error('chrome.storage.local:', error);
        return defaultValue;
      }
    },
    set: async value => {
      try {
        if (value === null) {
          await chrome.storage.local.remove(key);
        } else {
          await chrome.storage.local.set({ [key]: value });
        }
        trigger();
      } catch (error) {
        console.error('chrome.storage.local:', error);
      }
    }
  }));
}
