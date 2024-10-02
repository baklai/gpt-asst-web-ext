/* TELEGRAM WEB */

import { Assistant } from './asst.extension';

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
  } catch (err) {
    console.error(err);
  }
})();
