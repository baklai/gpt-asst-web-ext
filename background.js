const GPT_MESSAGES_BOX = [];

browser.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (data.action === 'mgs-from-webtg') {
    GPT_MESSAGES_BOX.push({ role: 'user', content: data.message });

    sendMessagesToOpenAI(GPT_MESSAGES_BOX)
      .then(response => {
        GPT_MESSAGES_BOX.push({ role: 'assistant', content: response });

        return sendResponse({ action: 'msg-from-gpt', message: response });
      })
      .catch(err => {
        sendResponse({ action: 'msg-from-gpt', message: err.message });
      });

    return true;
  }
});

async function sendMessagesToOpenAI(messages) {
  const { yourself, apikey } = await browser.storage.local.get();

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
