/* WTATSAPP WEB */

import { Assistant } from './asst.extension';

(async function () {
  try {
    const storage = await chrome.storage.local.get(['asst-apikey']);
    const manifest = chrome.runtime.getManifest();

    const assistant = new Assistant({
      apiKey: storage['asst-apikey'],
      name: manifest.name,
      description: manifest.description,
      version: manifest.version,
      selectors: {
        messages: 'div#main',
        message: 'div.message-in',
        input: 'footer p.selectable-text.copyable-text span.selectable-text.copyable-text span',
        button: 'span[data-icon="send"]'
      }
    });

    const observer = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node.querySelector('footer');
                if (element) {
                  const button = document.createElement('button');
                  button.style.fontSize = '100%';
                  button.style.display = 'flex';
                  button.style.alignItems = 'center';
                  button.style.width = '40px';
                  button.style.height = '50px';
                  button.style.justifyContent = 'center';
                  button.dataset.status = 'closed';
                  button.setAttribute('type', 'button');
                  button.setAttribute('aria-label', 'GPT Assistant');
                  button.setAttribute('title', 'GPT Assistant');

                  const btnImage = document.createElement('img');
                  const iconUrl = chrome.runtime.getURL('images/logo.svg');

                  btnImage.src = iconUrl;
                  btnImage.style.filter =
                    'invert(28%) sepia(5%) saturate(145%) hue-rotate(170deg) brightness(96%) contrast(92%)';
                  btnImage.style.transition = 'filter 0.3s ease';
                  btnImage.width = 28;
                  btnImage.height = 28;

                  button.addEventListener('mouseover', () => {
                    btnImage.style.filter = 'invert(100%)';
                  });

                  button.addEventListener('mouseout', () => {
                    btnImage.style.filter =
                      'invert(28%) sepia(5%) saturate(145%) hue-rotate(170deg) brightness(96%) contrast(92%)';
                  });

                  button.appendChild(btnImage);

                  button.addEventListener('click', async event => {
                    const buttonTarget = event.currentTarget;

                    if (buttonTarget.dataset.status === 'closed') {
                      assistant?.opened();
                      buttonTarget.dataset.status = 'opened';
                      buttonTarget.textContent = '⏹️';
                    } else {
                      assistant?.closed();
                      buttonTarget.dataset.status = 'closed';
                      buttonTarget.textContent = '▶️';
                    }
                    buttonTarget.blur();
                  });

                  element.firstChild.firstChild.firstChild.firstChild.appendChild(button);
                }
              }
            });
          }

          if (mutation.removedNodes.length > 0) {
            mutation.removedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName.toLowerCase() === 'footer') {
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

    observer.observe(document.body, { childList: true, subtree: true });
  } catch (err) {
    console.error(err);
  }
})();
