logger('Loading...');

assistant({ fill: 'tomato' });

function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function logger(msg) {
  console.info('[ASST]', `[${dateTimeToStr(new Date())}]`, msg);
}

function assistant({
  height = 50,
  width = 50,
  fill = 'currentColor',
  stroke = 'currentColor',
  shadow = '2px 4px 6px rgba(0, 0, 0, 0.3)'
}) {
  const icon = document.createElement('div');
  icon.style.backgroundColor = 'transparent';
  icon.style.position = 'fixed';
  icon.style.opacity = 0.5;
  icon.style.bottom = '20px';
  icon.style.right = '20px';
  icon.style.zIndex = '9999';
  icon.style.width = `${width + 8}px`;
  icon.style.height = `${height + 8}px`;

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="${height}" width="${width}" stroke="${stroke}" fill="${fill}" style="filter: drop-shadow(${shadow});">
      <title>robot</title>
      <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
    </svg>
  `;

  icon.innerHTML = svgIcon;

  document.body.appendChild(icon);
}

function randomRangeInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function dateTimeToStr(value) {
  return value ? new Date(value).toLocaleString() : value;
}

async function simulateTyping(element, value, delay = 150) {
  element.textContent = '';
  for (let char of value) {
    element.textContent += char;
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      data: char
    });
    element.dispatchEvent(inputEvent);

    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

async function scrollToBottom(container) {
  let scrollHeight = 0;
  let currentScrollHeight = container.scrollHeight;
  async function scrollStep() {
    scrollHeight = container.scrollHeight;
    container.scrollTo({
      top: scrollHeight,
      behavior: 'smooth'
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    currentScrollHeight = container.scrollHeight;
    if (scrollHeight < currentScrollHeight) {
      await scrollStep();
    }
  }
  await scrollStep();
}

function waitForSelector(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkForElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Элемент с селектором ${selector} не найден за ${timeout} мс`));
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
        reject(new Error(`Элементы с селектором ${selector} не найдены за ${timeout} мс`));
      } else {
        requestAnimationFrame(checkForElements);
      }
    };

    checkForElements();
  });
}

async function sendMessage(action, message) {
  try {
    await browser.runtime.sendMessage({ action: action, message: message });
  } catch (err) {
    console.error('[ASST] ERROR:', err.message);
  }
}
