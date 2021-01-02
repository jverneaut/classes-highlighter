import { GET_CLASSES, HIGHLIGHT_CLASSES } from './constants';

const highlightClassName = 'highlight';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action && request.action === GET_CLASSES) {
    const classes = Array.from(document.querySelectorAll('*'))
      .map(el => el.className)
      .filter(className => typeof className == 'string')
      .map(className => className.split(' '))
      .flat()
      .filter(className => className !== '');

    sendResponse(classes);
  }

  if (request.action && request.action === HIGHLIGHT_CLASSES) {
    Array.from(document.querySelectorAll('.' + highlightClassName)).forEach(el =>
      el.classList.remove(highlightClassName)
    );

    if (request.classes.length) {
      request.classes.forEach(({ name, active }) => {
        if (active) {
          Array.from(document.querySelectorAll('.' + name)).forEach(el =>
            el.classList.add(highlightClassName)
          );
        }
      });
    }
  }
});
