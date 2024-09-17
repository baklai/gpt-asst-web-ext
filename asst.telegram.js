browser.runtime.onMessage.addListener(postNewMessage);

initialization();

const watcher = {
  interval: null,
  timeout: 30000,

  start() {
    this.interval = setInterval(async () => {
      await searchNewMessage();
    }, this.timeout);
  },

  stop() {
    clearInterval(this.interval);
  }
};

async function initialization() {
  try {
    const { chatid, apikey } = await browser.storage.local.get();

    if (!chatid) {
      const chatlist = await getChatList();
      await browser.storage.local.set({ chatlist: JSON.stringify(chatlist) });
    }

    if (chatid && apikey) {
      logger(`CHAT ID [${chatid}] OPENNED`);
      watcher.start();
    }
  } catch (err) {
    console.error('[ASST] ERROR:', err.message);
  }
}

async function searchNewMessage() {
  try {
    const bubblesGroupInLastList = document.querySelectorAll('div.bubbles-group-last div.is-in');
    if (bubblesGroupInLastList.length) {
      const bubblesMessages = Array.from(bubblesGroupInLastList).map(bubble => {
        const newIncomingMessageEl = bubble.querySelector('span.translatable-message');
        return newIncomingMessageEl?.innerText || '';
      });

      if (bubblesMessages.length) {
        messageText = bubblesMessages.filter(item => item).join('\n');

        logger(`NEW MESSAGE IN CHAT: ${messageText}`);
        if (messageText) {
          watcher.stop();
          logger(`SEND NEW MESSAGE TO GPT: ${messageText}`);
          await sendMessage('mgs-from-webtg', messageText);
        }
      }
    }
  } catch (err) {
    console.error('[ASST] ERROR:', err.message);
  }
}

async function postNewMessage(message) {
  logger(`RESPONSE MESSAGE FROM GPT: ${message}`);
  const inputMessageEl = document.querySelector('div.input-message-input');
  if (inputMessageEl) {
    await simulateTyping(inputMessageEl, message);
    await pause(1000);
    const sendBtnEl = document.querySelector('div.btn-send-container > button.send');
    if (sendBtnEl) {
      sendBtnEl.click();
    }

    await pause(randomRangeInt(30000, 60000));

    watcher.start();
  }
}

async function getChatList(group = false) {
  const container = await waitForSelector('#folders-container div.scrollable');

  await scrollToBottom(container);

  container.scrollTo({
    top: container.scrollTo,
    behavior: 'smooth'
  });

  const chatlistarr = await waitForSelectorAll('ul.chatlist a');

  return (chatlist = Array.from(chatlistarr)
    .map(item => {
      const title = item.querySelector('span.peer-title');
      return {
        id: title.getAttribute('data-peer-id'),
        title: title.textContent,
        href: item.href
      };
    })
    .filter(item => group || !item?.id?.includes('-')));
}
