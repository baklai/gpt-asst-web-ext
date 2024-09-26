import { customRef } from 'vue';

export const contents = [
  {
    title: 'Tone and style of communication',
    content: '',
    example: 'Polite, friendly, formal or informal. Use of professional or casual vocabulary.'
  },
  {
    title: 'Role and Profession',
    content: '',
    example:
      'Specify the role you want to play (e.g. developer, manager, consultant). If you are communicating on behalf of a specific profession, it is important to emphasize this.'
  },
  {
    title: 'Values ​​and preferences',
    content: '',
    example:
      'What character traits do you want to convey (for example, openness, responsiveness, attention to detail).'
  },
  {
    title: 'Expectations from the interlocutor',
    content: '',
    example:
      'What level of knowledge do you assume your interlocutor has (beginner, experienced user, expert).'
  },
  {
    title: 'Specific instructions for conducting a conversation',
    content: '',
    example:
      'How to respond to questions, requests or conflicts (for example, maintain a dialogue even if the question is not clear).'
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
