class Logger {
  constructor() {}

  clear() {
    console.clear();
  }

  log(...args) {
    return console.log(
      `%c🤖 [ASST] LOG %c[${dateTimeToStr(new Date())}] %c${args}`,
      'color: black; font-size: 1rem; font-weight: bold;',
      'color: gray;',
      'color: black;'
    );
  }

  info(...args) {
    return console.log(
      `%c🤖 [ASST] INFO %c[${dateTimeToStr(new Date())}] %c${args}`,
      'color: blue; font-size: 1rem; font-weight: bold;',
      'color: gray;',
      'color: black;'
    );
  }

  warn(...args) {
    return console.log(
      `%c🤖 [ASST] WARN %c[${dateTimeToStr(new Date())}] %c${args}`,
      'color: #3390ec; font-size: 1rem; font-weight: bold;',
      'color: gray;',
      'color: black;'
    );
  }

  error(...args) {
    return console.log(
      `%c🤖 [ASST] ERROR %c[${dateTimeToStr(new Date())}] %c${args}`,
      'color: red; font-size: 1rem; font-weight: bold;',
      'color: gray;',
      'color: black;'
    );
  }
}

class Assistant extends Logger {
  constructor({ apiKey = null }) {
    super();

    this.chatid = null;
    this.observer = null;
    this.apikey = apiKey;

    this.messages = [];
    this.isTypingMsg = false;

    this.isObserving = false;

    this.clear();

    this.initChstObserver();
  }

  bage(name = 'Assistant', description = '', version = '') {
    console.group(`${name}`);
    console.log(
      `%c${name}\n%c${description}\n%cv${version}`,
      'color: #3390ec; font-size: 1.5rem; font-weight: bold; text-transform: uppercase; display: block; padding: 10px 0 10px 0;',
      'color: gray; font-size: 1rem; display: block; padding: 10px 0 10px 0;',
      'color: gray; font-size: 1rem; display: block; width: 100%; padding-bottom: 10px;'
    );
    console.groupEnd();
  }

  async opened() {
    if (!this.isObserving) {
      if (!window.location.hash) return;

      if (!this.apikey) return;

      this.chatid = window.location.hash;

      this.info(`CHAT ID [${this.chatid}] OPENED`);

      const containerEl = document.querySelector('div.messages-container');

      this.observer.observe(containerEl, {
        childList: true,
        subtree: true
      });

      this.isObserving = true;
    }
  }

  closed() {
    if (this.isObserving) {
      if (this.chatid) this.warn(`CHAT ID [${this.chatid}] CLOSED`);
      if (this.observer) this.observer.disconnect();

      this.isObserving = false;
      this.chatid = null;
    }
  }

  status() {
    return this.isObserving;
  }

  initChstObserver() {
    this.observer = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (
                  node.classList.contains('message-list-item') &&
                  !node.classList.contains('own')
                ) {
                  const element = node.querySelector('div.text-content');

                  const clonedElement = element.cloneNode(true);
                  clonedElement.querySelectorAll('span').forEach(span => span.remove());

                  const textContent = clonedElement.textContent.trim();

                  if (textContent) {
                    this.log(`SENDING MESSAGE TO GPT: ${textContent}`);
                    this.messages.push(textContent);
                    this.processNextMessage();
                  }
                }
              }
            });
          }
        }
      });
    });
  }

  async processNextMessage() {
    if (this.isTypingMsg || !this.messages.length) {
      return;
    }

    this.isTypingMsg = true;
    const message = this.messages.shift();

    try {
      const { message: responseMessage } = await browserRuntimeSendMessage({
        action: 'mgs-from-webtg',
        chatid: this.chatid,
        message
      });
      this.log(`RESPONSE MESSAGE FROM GPT: ${responseMessage}`);
      await this.publishMessage(responseMessage);
    } catch (err) {
      this.error(err.message);
    } finally {
      this.isTypingMsg = false;
      this.processNextMessage();
    }
  }

  async publishMessage(message) {
    const inputMessageEl = document.querySelector('div#editable-message-text');
    if (inputMessageEl) {
      await simulateTyping(inputMessageEl, message);

      const sendBtnEl = document.querySelector('button.main-button.click-allowed');
      if (sendBtnEl) {
        sendBtnEl.click();
      } else {
        inputMessageEl.textContent = '';
      }
    }
  }
}

function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomRange(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function dateTimeToStr(value) {
  return value ? new Date(value).toLocaleString() : value;
}

async function simulateTyping(element, value, delay = 200) {
  element.focus();
  element.click();
  element.textContent = '';
  const selection = window.getSelection();
  const range = document.createRange();

  for (let char of value) {
    element.textContent += char;
    range.setStart(element.childNodes[0], element.textContent.length);
    range.setEnd(element.childNodes[0], element.textContent.length);
    selection.removeAllRanges();
    selection.addRange(range);

    const keydownEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: char
    });
    element.dispatchEvent(keydownEvent);

    const inputEvent = new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      data: char
    });
    element.dispatchEvent(inputEvent);

    const keyupEvent = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      key: char
    });
    element.dispatchEvent(keyupEvent);

    await new Promise(resolve => setTimeout(resolve, delay));
  }

  element.blur();
}

async function browserRuntimeSendMessage({ action, chatid, message }) {
  try {
    return await chrome.runtime.sendMessage({ action, chatid, message });
  } catch (err) {
    throw new Error(err.message);
  }
}

(async function () {
  try {
    const storage = await chrome.storage.local.get(['asst-apikey']);

    const assistant = new Assistant({ apiKey: storage['asst-apikey'] });

    const layoutObserver = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node.querySelector('div#message-input-text');
                if (element) {
                  const button = document.createElement('button');
                  button.style.fontSize = '24px';
                  button.dataset.status = 'closed';
                  button.setAttribute('type', 'button');
                  button.setAttribute('class', 'Button default secondary round click-allowed');
                  button.setAttribute('aria-label', 'GPT Assistant');
                  button.setAttribute('title', 'GPT Assistant');

                  const btnImage = document.createElement('img');
                  const iconUrl = chrome.runtime.getURL('images/logo.svg');

                  btnImage.src = iconUrl;
                  btnImage.style.filter =
                    'invert(61%) sepia(0%) saturate(0%) hue-rotate(184deg) brightness(90%) contrast(89%)';
                  btnImage.style.transition = 'filter 0.3s ease';
                  btnImage.width = 24;
                  btnImage.height = 24;

                  button.addEventListener('mouseover', () => {
                    btnImage.style.filter = 'invert(100%)';
                  });

                  button.addEventListener('mouseout', () => {
                    btnImage.style.filter =
                      'invert(61%) sepia(0%) saturate(0%) hue-rotate(184deg) brightness(90%) contrast(89%)';
                  });

                  button.appendChild(btnImage);

                  button.addEventListener('click', async event => {
                    const buttonTarget = event.currentTarget;

                    if (buttonTarget.dataset.status === 'closed') {
                      await assistant?.opened();
                      buttonTarget.dataset.status = 'opened';
                      buttonTarget.textContent = '⏹️';
                    } else {
                      assistant?.closed();
                      buttonTarget.dataset.status = 'closed';
                      buttonTarget.textContent = '▶️';
                    }
                    buttonTarget.blur();
                  });

                  element.parentNode.parentNode.parentNode.appendChild(button);
                }
              }
            });
          }

          if (mutation.removedNodes.length > 0) {
            mutation.removedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (
                  node.classList.contains('Composer') &&
                  node.classList.contains('shown') &&
                  node.classList.contains('mounted')
                ) {
                  if (assistant?.isObserving) {
                    assistant.closed();
                  }
                }
              }
            });
          }
        }
      });
    });

    layoutObserver.observe(document.body, { childList: true, subtree: true });

    const { name, description, version } = chrome.runtime.getManifest();

    assistant.bage(name, description, version);
  } catch (err) {
    console.error(err);
  }
})();
