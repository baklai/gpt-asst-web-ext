const DEFAULT_SYSTEM_MESSAGE = 'You are a helpful assistant.';

const MESSAGE_BOX = [];

browser.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
  if (data.action === 'mgs-from-webtg') {
    MESSAGE_BOX.push({ role: 'user', content: data.message });
    await sendMessageToOpenAI(data.message);
  }
});

async function sendMessageToOpenAI(message) {
  const { yourself, apikey } = await browser.storage.local.get();

  const requestData = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: yourself || DEFAULT_SYSTEM_MESSAGE
      },
      ...MESSAGE_BOX
    ]
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
      await sendMessageToTabWebTG(choice.message.content);
    }
  } catch (err) {
    await sendMessageToTabWebTG('🤷');
    console.error('There was an error:', err.message);
  }
}

async function sendMessageToTabWebTG(message) {
  try {
    const tabs = await browser.tabs.query({});
    const webTgTab = tabs.find(tab => tab.title.includes('Telegram Web'));
    if (webTgTab) {
      try {
        MESSAGE_BOX.push({ role: 'assistant', content: message });
        browser.tabs.sendMessage(webTgTab.id, message);
      } catch (err) {
        console.error('ERROR:', err.message);
      }
    }
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}
