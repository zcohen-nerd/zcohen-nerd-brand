import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup, within} from '@testing-library/react';
import Footer from '../src/components/Footer';
import projects from '../src/data/projects';
import {isExternalUrl} from '../src/utils/isExternal';

afterEach(cleanup);

describe('Footer — rendered link inventory', () => {
  it('has an Ecosystem column with one link per registry entry, in order', () => {
    render(<Footer />);
    const eco = screen.getByText('Ecosystem').parentElement;
    const hrefs = within(eco)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(projects.map((p) => p.href));
  });

  it('has a Connect column driven by brand.connectLinks', () => {
    render(<Footer />);
    const connect = screen.getByText('Connect').parentElement;
    const labels = within(connect)
      .getAllByRole('link')
      .map((a) => a.textContent.replace(/\s*↗.*/, '').trim());
    expect(labels).toEqual(['GitHub', 'Email']);
  });

  it('announces external links and only external links', () => {
    render(<Footer />);
    for (const a of screen.getAllByRole('link')) {
      expect(a.textContent.includes('(opens external site)')).toBe(
        isExternalUrl(a.getAttribute('href')),
      );
    }
  });

  it('renders the two column headings once each', () => {
    render(<Footer />);
    expect(screen.getAllByText('Ecosystem')).toHaveLength(1);
    expect(screen.getAllByText('Connect')).toHaveLength(1);
  });
});
