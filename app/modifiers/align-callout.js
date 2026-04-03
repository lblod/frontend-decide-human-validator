import { modifier } from 'ember-modifier';

const width = 400;

// the second argument is necessary to have this trigger when the annotation changes
export default modifier((element, [_annotation]) => {
  setTimeout(() => {
    element.style.left = 'auto';
    element.classList.remove('right');
    if (!element.parentElement) {
      return;
    }
    const left = element.parentElement.offsetLeft;
    if (left > width) {
      element.classList.add('right');
    }

    if (left + width > element.parentElement.parentElement.clientWidth) {
      element.style.left = `-${left - 10}px`;
    }
  }, 300);

  return () => {};
});
