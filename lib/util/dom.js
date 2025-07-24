/**
 * @param {Node} parent
 * @param {Node} child
 */
export function insertAtStart(parent, child) {
  if (parent.firstChild) {
    parent.insertBefore(child, parent.firstChild);
  } else {
    parent.appendChild(child);
  }
}

/**
 * @param {HTMLElement | undefined} element
 * @param {number | boolean | string | null | undefined} value
 */
export function setDisable(element, value) {
  if (element == null) return;
  switch (value) {
    case undefined:
    case null:
    case '':
    case false:
    case 0:
      element.removeAttribute('disabled');
      break;
    default:
      element.setAttribute('disabled', 'disabled');
  }
}
