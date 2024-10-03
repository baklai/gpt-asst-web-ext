class Logger {
  constructor() {}

  clear() {
    console.clear();
  }

  info(...args) {
    return console.log(
      `%c🤖 [ASST] %c[${dateTimeToStr(new Date())}] %c${args}`,
      'color: #0ea5e9; font-size: 0.75rem; font-weight: bold;',
      'color: gray; font-size: 0.75rem;',
      'font-size: 0.75rem;'
    );
  }

  warn(...args) {
    return console.log(
      `%c🤖 [ASST] %c[${dateTimeToStr(new Date())}] %c${args}`,
      'color: tomato; font-size: 0.75rem; font-weight: bold;',
      'color: gray; font-size: 0.75rem;',
      'font-size: 0.75rem;'
    );
  }
}

export function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomRange(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function dateTimeToStr(value) {
  return value ? new Date(value).toLocaleString() : value;
}

export class Assistant extends Logger {
  constructor({
    apiKey = null,
    name = 'GPT Assistant',
    description = '',
    version = '',
    selectors = { messages: 'body', message: 'div', input: 'input', button: 'button' }
  }) {
    super();

    this.name = name;
    this.description = description;
    this.version = version;

    this.chatid = null;
    this.observer = null;
    this.apikey = apiKey;

    this.messages = [];
    this.isTypingMsg = false;

    this.isObserving = false;

    this.selectors = { ...selectors };

    this.initialization();

    this.initChatObserver();
  }

  opened() {
    if (!this.isObserving) {
      // if (!window.location.hash) return;

      if (!this.apikey) return;

      this.chatid = window.location.hash || '###';

      this.info(`CHAT ID [${this.chatid}] OPENED`);

      const containerEl = document.querySelector(this.selectors.messages);

      this.observer.observe(containerEl, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      });

      this.isObserving = true;
    }
  }

  closed() {
    if (this.isObserving) {
      if (this.chatid) this.info(`CHAT ID [${this.chatid}] CLOSED`);
      if (this.observer) this.observer.disconnect();

      this.isObserving = false;
      this.chatid = null;
    }
  }

  initialization() {
    console.clear();

    console.group(`🤖 ${this.name}`);
    console.log(
      `%c${this.name}%c v${this.version}\n%c${this.description}`,
      'color: #0ea5e9; font-size: 1.5rem; font-weight: bold; text-transform: uppercase; display: block; width: 100%; padding: 10px 0 10px 10px;',
      'color: gray; font-size: 1rem; display: block;',
      'color: gray; font-size: 1rem; display: block; padding: 0 0 10px 10px;'
    );
    console.groupEnd();
  }

  initChatObserver() {
    this.observer = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node.querySelector(this.selectors.message);

                if (element) {
                  const clonedElement = element.cloneNode(true);

                  clonedElement.querySelectorAll('span').forEach(span => span.remove());
                  const textContent = clonedElement.textContent.trim();
                  if (textContent) {
                    this.info(`SENDING MESSAGE TO GPT: ${textContent}`);
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
      const { message: responseMessage } = await this.browserRuntimeSendMessage({
        action: 'mgs-from-webtg',
        chatid: this.chatid,
        message
      });
      this.info(`RESPONSE MESSAGE FROM GPT: ${responseMessage}`);
      await this.publishMessage(responseMessage);
    } catch (err) {
      this.warn(err.message);
    } finally {
      this.isTypingMsg = false;
      this.processNextMessage();
    }
  }

  async publishMessage(message) {
    const inputMessageEl = document.querySelector(this.selectors.input);
    if (inputMessageEl) {
      await this.simulateTyping(inputMessageEl, message);

      const sendBtnEl = document.querySelector(this.selectors.button);
      if (sendBtnEl) {
        sendBtnEl.click();
      } else {
        inputMessageEl.textContent = '';
      }
    }
  }

  async simulateTyping(element, value, delay = 200) {
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

  async browserRuntimeSendMessage({ action, chatid, message }) {
    try {
      return await chrome.runtime.sendMessage({ action, chatid, message });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
