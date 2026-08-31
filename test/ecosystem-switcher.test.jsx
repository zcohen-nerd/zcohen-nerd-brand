import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EcosystemSwitcher, {
  DISCLOSURE_ID,
  NAV_GROUPS,
} from '../src/components/Navbar/EcosystemSwitcher';
import projects from '../src/data/projects';
import {isExternalUrl} from '../src/utils/isExternal';

afterEach(cleanup);

const trigger = () => screen.getByRole('button', {name: 'Ecosystem'});
const panel = () => document.getElementById(DISCLOSURE_ID);

describe('EcosystemSwitcher — disclosure semantics', () => {
  it('is a disclosure, not a menu: trigger wires aria-expanded + aria-controls', () => {
    render(<EcosystemSwitcher />);
    expect(trigger()).toHaveAttribute('aria-controls', DISCLOSURE_ID);
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  it('starts closed: panel present in the DOM but [hidden]', () => {
    render(<EcosystemSwitcher />);
    expect(panel()).toBeInTheDocument();
    expect(panel()).toHaveAttribute('hidden');
  });

  it('toggles open and closed on click', async () => {
    const user = userEvent.setup();
    render(<EcosystemSwitcher />);
    await user.click(trigger());
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(panel()).not.toHaveAttribute('hidden');
    await user.click(trigger());
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(panel()).toHaveAttribute('hidden');
  });

  it('Escape closes it and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<EcosystemSwitcher />);
    await user.click(trigger());
    expect(panel()).not.toHaveAttribute('hidden');
    await user.keyboard('{Escape}');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(panel()).toHaveAttribute('hidden');
    expect(document.activeElement).toBe(trigger());
  });

  it('an outside click closes it without stealing focus', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <EcosystemSwitcher />
        <button type="button">outside</button>
      </div>,
    );
    await user.click(trigger());
    await user.click(screen.getByRole('button', {name: 'outside'}));
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('EcosystemSwitcher — rendered link inventory', () => {
  // The panel is server-rendered even while closed (crawlable / no-JS). Query
  // with {hidden: true} so the inventory is asserted against the DOM as shipped.
  const panelLinks = () => within(panel()).getAllByRole('link', {hidden: true});

  it('renders exactly one link per registry entry, in registry order', () => {
    render(<EcosystemSwitcher />);
    expect(panelLinks().map((a) => a.getAttribute('href'))).toEqual(
      projects.map((p) => p.href),
    );
  });

  it('groups the links as Featured destinations then Tools & projects', () => {
    render(<EcosystemSwitcher />);
    const text = panel().textContent;
    expect(text.indexOf('Featured destinations')).toBeGreaterThanOrEqual(0);
    expect(text.indexOf('Tools & projects')).toBeGreaterThan(
      text.indexOf('Featured destinations'),
    );
    // every registry project lands in exactly one group
    const grouped = NAV_GROUPS.flatMap((g) => g.items).map((p) => p.name);
    expect(new Set(grouped).size).toBe(projects.length);
  });

  it('announces external links and only external links', () => {
    render(<EcosystemSwitcher />);
    for (const a of panelLinks()) {
      const external = isExternalUrl(a.getAttribute('href'));
      const announces = a.textContent.includes('(opens external site)');
      expect(announces).toBe(external);
      if (external) {
        // the visible arrow glyph rides along with the SR-only phrase
        expect(a.textContent).toContain('↗');
      }
    }
  });

  it('marks the current project with aria-current="page"', () => {
    render(
      <EcosystemSwitcher projectUrl="https://portfolio.zcohen-nerd.com/" />,
    );
    const current = panelLinks().filter(
      (a) => a.getAttribute('aria-current') === 'page',
    );
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAttribute(
      'href',
      'https://portfolio.zcohen-nerd.com/',
    );
  });
});
