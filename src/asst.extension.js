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

    this.initObserver();
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

  initAsstBtn(element) {
    if (element) {
      const button = document.createElement('button');
      button.textContent = '▶️';
      button.style.fontSize = '24px';
      button.setAttribute('type', 'button');
      button.setAttribute('class', 'Button record default secondary round click-allowed');
      button.setAttribute('aria-label', 'GPT Assistant message');
      button.setAttribute('title', 'GPT Assistant message');

      button.addEventListener('click', e => {
        if (e.target.textContent === '▶️') {
          e.target.textContent = '⏹️';
        } else {
          e.target.textContent = '▶️';
        }
        e.target.blur();
      });

      element.appendChild(button);
    }
  }

  initObserver() {
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

function waitForSelector(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkForElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element with selector ${selector} not found in ${timeout} ms`));
      } else {
        requestAnimationFrame(checkForElement);
      }
    };

    checkForElement();
  });
}

function waitForSelectorAll(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkForElements = () => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        resolve(Array.from(elements));
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element with selector ${selector} not found in ${timeout} ms`));
      } else {
        requestAnimationFrame(checkForElements);
      }
    };

    checkForElements();
  });
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
    const { apikey } = await chrome.storage.local.get();

    const assistant = new Assistant({ apiKey: apikey });

    const footer = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node.querySelector('div#message-input-text');
                if (element) {
                  const container = document.createElement('div');
                  container.style.display = 'flex';
                  container.style.alignItems = 'center';

                  const span = document.createElement('span');
                  span.textContent = 'GPT Assistant stoped...';
                  span.style.color = 'gray';

                  const button = document.createElement('button');
                  button.textContent = '▶️';
                  button.style.width = '2rem';
                  button.style.height = '2rem';
                  button.setAttribute('type', 'button');
                  button.setAttribute('class', 'Button default translucent');
                  button.setAttribute('aria-label', 'Run/Stop GPT Assistant');
                  button.setAttribute('title', 'Run/Stop GPT Assistant');

                  button.addEventListener('click', async event => {
                    if (event.target.textContent === '▶️') {
                      await assistant?.opened();
                      span.textContent = 'GPT Assistant running...';
                      event.target.textContent = '⏹️';
                    } else {
                      assistant?.closed();
                      span.textContent = 'GPT Assistant stoped...';
                      event.target.textContent = '▶️';
                    }
                    event.target.blur();
                  });

                  container.appendChild(button);
                  container.appendChild(span);

                  element.appendChild(container);
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

    footer.observe(document.body, { childList: true, subtree: true });

    const { name, description, version } = chrome.runtime.getManifest();

    assistant.bage(name, description, version);
  } catch (err) {
    console.error(err);
  }
})();
