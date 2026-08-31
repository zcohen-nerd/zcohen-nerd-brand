/**
 * Focus-trap helpers for the mobile drawer dialog.
 *
 * Extracted so the Tab-cycling behaviour can be unit-tested without rendering
 * the whole Navbar (which pulls in Docusaurus theme context). The drawer
 * component still owns Escape, scroll-lock, and focus-return.
 */

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';

/** All tabbable elements inside `container`, in DOM order. */
function getFocusable(container) {
  if (!container) {
    return [];
  }
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
}

/**
 * Given a Tab keydown inside a trapped container, return the element focus
 * should wrap to — or `null` when the browser's native Tab order is fine
 * (i.e. focus is not on an edge element).
 */
function nextTrapTarget(container, activeElement, shiftKey) {
  const focusable = getFocusable(container);
  if (focusable.length === 0) {
    return null;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (shiftKey && activeElement === first) {
    return last;
  }
  if (!shiftKey && activeElement === last) {
    return first;
  }
  return null;
}

module.exports = {FOCUSABLE_SELECTOR, getFocusable, nextTrapTarget};
module.exports.getFocusable = getFocusable;
module.exports.nextTrapTarget = nextTrapTarget;
