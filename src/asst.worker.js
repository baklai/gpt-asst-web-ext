const GPT_MESSAGES_BOX = [];

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(error => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
  console.log('Расширение установлено!');
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '/icons/icon-128.png',
    title: 'GPT Assistant for Telegram',
    message: "Don't forget to pin our extension to your toolbar!",
    priority: 1
  });
});

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (data.action === 'mgs-from-webtg') {
    GPT_MESSAGES_BOX.push({ role: 'user', chatid: data.chatid, content: data.message });

    const messages = GPT_MESSAGES_BOX.filter(item => item.chatid === data.chatid).map(item => {
      return {
        role: item.role,
        content: item.content
      };
    });

    sendMessagesToOpenAI(messages)
      .then(response => {
        GPT_MESSAGES_BOX.push({ role: 'assistant', chatid: data.chatid, content: response });

        return sendResponse({ action: 'msg-from-gpt', chatid: data.chatid, message: response });
      })
      .catch(err => {
        return sendResponse({ action: 'msg-from-gpt', chatid: data.chatid, message: err.message });
      });

    return true;
  }
});

async function sendMessagesToOpenAI(messages) {
  const { yourself, apikey } = await chrome.storage.local.get();

  if (!apikey) throw new Error('🤷');

  const DEFAULT_SYSTEM_MESSAGE = 'You are a helpful assistant.';
  const API_URL = 'https://api.openai.com/v1/chat/completions';

  const requestData = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: yourself || DEFAULT_SYSTEM_MESSAGE
      },
      ...messages // [{ role: 'user', content: 'this is message'}]
    ]
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const [choice] = data.choices;

    if (data?.choices && choice?.message?.content) {
      return choice.message.content;
    }

    throw new Error('🤷');
  } catch (err) {
    throw new Error('🤷');
  }
}
