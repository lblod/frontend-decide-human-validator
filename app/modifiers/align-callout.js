import { modifier } from 'ember-modifier';

export default modifier((element, [_annotation]) => {
  element.classList.remove('right');
  if (element.parentElement.offsetLeft > element.clientWidth) {
    element.classList.add('right');
  }

  return () => {};
});
