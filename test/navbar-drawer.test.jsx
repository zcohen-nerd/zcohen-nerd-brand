import React from 'react';
import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup, fireEvent, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../src/components/Navbar';
import projects from '../src/data/projects';
import {isExternalUrl} from '../src/utils/isExternal';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

const drawer = () => document.getElementById('zc-mobile-drawer');
// Once the drawer is open its in-drawer close control also carries a
// "Close menu" accessible name, so pick the trigger that lives outside it.
const drawerTrigger = () =>
  screen
    .getAllByRole('button', {name: /open menu|close menu/i})
    .find((b) => !drawer().contains(b));

describe('mobile drawer — dialog semantics', () => {
  it('is a labelled modal dialog, present in the DOM, [hidden] when closed', () => {
    render(<Navbar />);
    expect(drawer()).toBeInTheDocument();
    expect(drawer()).toHaveAttribute('role', 'dialog');
    expect(drawer()).toHaveAttribute('aria-modal', 'true');
    expect(drawer()).toHaveAttribute('aria-label', 'Menu');
    expect(drawer()).toHaveAttribute('hidden');
    expect(drawerTrigger()).toHaveAttribute('aria-controls', 'zc-mobile-drawer');
    expect(drawerTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens: aria-expanded flips, [hidden] drops, scrim renders, body scroll locks, focus enters', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    await user.click(drawerTrigger());

    expect(drawerTrigger()).toHaveAttribute('aria-expanded', 'true');
    expect(drawerTrigger()).toHaveAccessibleName('Close menu');
    expect(drawer()).not.toHaveAttribute('hidden');
    expect(document.body.style.overflow).toBe('hidden');
    // focus moved into the drawer (onto the close control, the first focusable)
    expect(drawer().contains(document.activeElement)).toBe(true);
    expect(document.activeElement).toHaveAccessibleName('Close menu');
  });

  it('closes via the in-drawer close button and returns focus + unlocks scroll', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    await user.click(drawerTrigger());
    await user.click(within(drawer()).getByRole('button', {name: 'Close menu'}));

    expect(drawer()).toHaveAttribute('hidden');
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(drawerTrigger());
  });

  it('Escape closes it and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    await user.click(drawerTrigger());
    fireEvent.keyDown(drawer(), {key: 'Escape'});

    expect(drawer()).toHaveAttribute('hidden');
    expect(document.activeElement).toBe(drawerTrigger());
    expect(document.body.style.overflow).toBe('');
  });

  it('traps Tab: from the last link it wraps to the close button; Shift+Tab from close wraps to the last link', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    await user.click(drawerTrigger());

    const focusables = drawer().querySelectorAll('a[href], button:not([disabled])');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    last.focus();
    fireEvent.keyDown(drawer(), {key: 'Tab'});
    expect(document.activeElement).toBe(first);

    first.focus();
    fireEvent.keyDown(drawer(), {key: 'Tab', shiftKey: true});
    expect(document.activeElement).toBe(last);
  });
});

describe('mobile drawer — rendered link inventory', () => {
  it('lists the hub nav links then every registry project, in order, once each', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    await user.click(drawerTrigger());

    const hrefs = within(drawer())
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([
      '/work',
      'https://zcohennerd.substack.com/',
      '/about',
      ...projects.map((p) => p.href),
    ]);
  });

  it('announces external links (and only those) inside the drawer', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    await user.click(drawerTrigger());
    const links = within(drawer()).getAllByRole('link');
    const externalAnnounced = links.filter((a) =>
      a.textContent.includes('(opens external site)'),
    );
    // the substack nav link + every github.com / non-family registry entry
    expect(externalAnnounced.length).toBeGreaterThan(0);
    for (const a of links) {
      const external = isExternalUrl(a.getAttribute('href'));
      expect(a.textContent.includes('(opens external site)')).toBe(external);
    }
  });
});
