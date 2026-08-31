import {describe, it, expect, beforeEach} from 'vitest';
import {getFocusable, nextTrapTarget} from '../src/components/Navbar/focusTrap';

describe('focusTrap', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="c">
        <button id="close">x</button>
        <a id="a1" href="/one">one</a>
        <button id="disabled" disabled>nope</button>
        <a id="a2" href="/two">two</a>
        <a id="last" href="/three">three</a>
      </div>`;
    container = document.getElementById('c');
  });

  it('getFocusable returns tabbable elements in DOM order, skipping [disabled]', () => {
    expect(getFocusable(container).map((el) => el.id)).toEqual([
      'close',
      'a1',
      'a2',
      'last',
    ]);
  });

  it('getFocusable is safe on a null container', () => {
    expect(getFocusable(null)).toEqual([]);
  });

  it('Tab on the last element wraps to the first', () => {
    const target = nextTrapTarget(
      container,
      document.getElementById('last'),
      false,
    );
    expect(target?.id).toBe('close');
  });

  it('Shift+Tab on the first element wraps to the last', () => {
    const target = nextTrapTarget(
      container,
      document.getElementById('close'),
      true,
    );
    expect(target?.id).toBe('last');
  });

  it('Tab in the middle returns null (let the browser handle it)', () => {
    expect(
      nextTrapTarget(container, document.getElementById('a1'), false),
    ).toBeNull();
    expect(
      nextTrapTarget(container, document.getElementById('a2'), true),
    ).toBeNull();
  });

  it('returns null when the container has no focusable children', () => {
    document.body.innerHTML = '<div id="empty"><span>text</span></div>';
    expect(
      nextTrapTarget(document.getElementById('empty'), null, false),
    ).toBeNull();
  });
});
