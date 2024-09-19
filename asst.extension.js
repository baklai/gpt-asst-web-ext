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
      'color: tomato; font-size: 1rem; font-weight: bold;',
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

    this.assistant({});

    this.initObserver();
  }

  bage(name = 'Assistant', description = '', version = '') {
    return console.log(
      `%c🤖 ${name} %c${description} %cv${version}`,
      'color: tomato; font-size: 1.5rem; font-weight: bold; text-transform: uppercase; display: block; width: 100%; text-align: center; padding: 20px 0 10px 0;',
      'color: gray; font-size: 1rem; display: block; max-width: 50%; text-align: center; margin: 0 auto; padding-bottom: 5px;',
      'color: gray; font-size: 1rem; display: block; text-align: center; padding-bottom: 20px;'
    );
  }

  async opened() {
    if (!this.isObserving) {
      if (!window.location.hash) return;

      if (!this.apikey) return;

      this.chatid = window.location.hash;

      this.info(`CHAT ID [${this.chatid}] OPENED`);

      this.observer.observe(document.body, {
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

  assistant({ tooltip = 'Assistant to chat' }) {
    const width = 50;
    const height = 50;
    const fill = 'gray' || 'tomato';
    const stroke = 'currentColor';
    const shadow = '2px 4px 6px rgba(0, 0, 0, 0.3)';

    const containerEl = document.createElement('div');
    Object.assign(containerEl.style, {
      backgroundColor: 'transparent',
      position: 'fixed',
      opacity: '0.5',
      bottom: '20px',
      right: '20px',
      zIndex: '9999',
      cursor: 'pointer',
      width: `${width + 8}px`,
      height: `${height + 8}px`
    });

    const iconEl = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
      height="${height}" 
      width="${width}" 
      stroke="${stroke}" 
      fill="${fill}" 
      style="filter: drop-shadow(${shadow});"
    >
      <title>${tooltip}</title>
      <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
    </svg>
    `;

    containerEl.innerHTML = iconEl;

    const tooltipEl = document.createElement('div');
    tooltipEl.innerText = tooltip;
    Object.assign(tooltipEl.style, {
      display: 'block',
      content: '',
      position: 'absolute',
      top: '50%',
      transform: 'translateX(-10px) translateY(-50%)',
      padding: '5px 10px',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      color: 'white',
      borderRadius: '5px',
      fontSize: '12px',
      whiteSpace: 'nowrap',
      visibility: 'hidden',
      opacity: '0',
      transition: 'visibility 0s, opacity 0.3s ease'
    });

    const tooltipArrowEl = document.createElement('div');
    Object.assign(tooltipArrowEl.style, {
      position: 'absolute',
      right: '-8px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderTop: '5px solid transparent',
      borderBottom: '5px solid transparent',
      borderLeft: '8px solid rgba(0, 0, 0, 0.75)'
    });

    tooltipEl.appendChild(tooltipArrowEl);
    containerEl.appendChild(tooltipEl);

    containerEl.addEventListener('mouseover', () => {
      const tooltipWidth = tooltipEl.offsetWidth;
      tooltipEl.style.left = `-${tooltipWidth}px`;

      containerEl.style.opacity = '0.6';
      tooltipEl.style.visibility = 'visible';
      tooltipEl.style.opacity = '1';
    });

    containerEl.addEventListener('mouseout', () => {
      containerEl.style.opacity = '0.5';
      tooltipEl.style.visibility = 'hidden';
      tooltipEl.style.opacity = '0';
    });

    containerEl.addEventListener('click', () => {
      const svg = containerEl.querySelector('svg');

      const isObserving = this.status();

      if (isObserving) {
        this.closed();
      } else {
        this.opened();
      }

      const isClosedOrOpened = this.status();

      if (!isClosedOrOpened) {
        svg.setAttribute('fill', 'gray');
        svg.setAttribute('stroke', 'currentColor');
      } else {
        svg.setAttribute('fill', 'tomato');
        svg.setAttribute('stroke', 'currentColor');
      }
    });

    document.body.appendChild(containerEl);
  }

  initObserver() {
    this.observer = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const newElement = node.querySelector('div.bubble.is-in span.translatable-message');
                if (newElement) {
                  const textContent = newElement.textContent;
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
    const inputMessageEl = document.querySelector('div.input-message-input');
    if (inputMessageEl) {
      await simulateTyping(inputMessageEl, message);

      const sendBtnEl = document.querySelector('div.btn-send-container > button.send');
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
  element.textContent = '';

  element.focus();

  element.click();

  for (let char of value) {
    const keydownEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: char
    });
    element.dispatchEvent(keydownEvent);

    element.textContent += char;

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
    return await browser.runtime.sendMessage({ action, chatid, message });
  } catch (err) {
    throw new Error(err.message);
  }
}
