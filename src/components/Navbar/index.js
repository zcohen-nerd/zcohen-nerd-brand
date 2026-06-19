import React, {useState, useEffect, useRef} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import projects from '../../data/projects';
import styles from './styles.module.css';

/**
 * Shared zcohen-nerd Navbar (swizzled @theme/Navbar replacement).
 *
 * Reads siteConfig.customFields.brand for project-aware configuration.
 * Hub mode (isHub: true)     — renders brand.navLinks (Work / Writing / About).
 * Project mode (isHub: false) — renders brand.projectBadge instead of nav links.
 *
 * Set in docusaurus.config.ts:
 *   customFields: { brand: { isHub: false, projectBadge: 'A zcohen-nerd technical guide', ... } }
 */

const DEFAULT_BRAND = {
  projectName: 'zcohen-nerd',
  projectFamily: 'hub',
  projectBadge: 'zcohen-nerd',
  hubUrl: 'https://zcohen-nerd.github.io/',
  projectUrl: 'https://zcohen-nerd.github.io/',
  repoUrl: 'https://github.com/zcohen-nerd',
  attribution: 'Practical engineering, systems thinking, and modern literacy — documented in public.',
  isHub: true,
  navLinks: [
    {label: 'Work', href: '#'},
    {label: 'Writing', href: '#'},
    {label: 'About', href: '#'},
  ],
  connectLinks: [
    {label: 'GitHub', href: 'https://github.com/zcohen-nerd'},
    {label: 'Email', href: 'mailto:hello@zcohen-nerd.com'},
  ],
};

function ProjectSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={styles.switcher} ref={ref}>
      <button
        type="button"
        className={styles.switcherPill}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}>
        Projects <span className={styles.caret} aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className={styles.dropdown} role="menu">
          {projects.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className={styles.dropdownItem}
              role="menuitem"
              onClick={() => setOpen(false)}>
              <span className={styles.dropdownEmoji} aria-hidden="true">
                {p.emoji}
              </span>
              <span className={styles.dropdownName}>{p.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const {siteConfig} = useDocusaurusContext();
  const brand = {...DEFAULT_BRAND, ...siteConfig.customFields?.brand};
  const isHub = brand.isHub ?? true;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const logoUrl = useBaseUrl('/img/zcohen-nerd-logo.png');

  return (
    <header className={styles.header}>
      <a href={brand.hubUrl} className={styles.logoLink} aria-label="zcohen-nerd home">
        <img className={styles.logo} src={logoUrl} alt="zcohen-nerd" />
      </a>

      <nav className={styles.nav} aria-label="Primary">
        {isHub
          ? brand.navLinks.map((l) => (
              <a key={l.label} href={l.href} className={styles.navLink}>
                {l.label}
              </a>
            ))
          : <span className={styles.badge}>{brand.projectBadge}</span>
        }
        <ProjectSwitcher />
      </nav>

      <button
        type="button"
        className={styles.menuToggle}
        aria-label="Open menu"
        aria-expanded={drawerOpen}
        onClick={() => setDrawerOpen((v) => !v)}>
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
      </button>

      {drawerOpen && (
        <>
          <div
            className={styles.scrim}
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className={styles.drawer} role="dialog" aria-label="Menu">
            {isHub
              ? brand.navLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className={styles.drawerLink}
                    onClick={() => setDrawerOpen(false)}>
                    {l.label}
                  </a>
                ))
              : <span className={styles.drawerBadge}>{brand.projectBadge}</span>
            }
            <div className={styles.drawerHeading}>Projects</div>
            {projects.map((p) => (
              <a
                key={p.name}
                href={p.href}
                className={styles.drawerLink}
                onClick={() => setDrawerOpen(false)}>
                <span aria-hidden="true">{p.emoji}</span> {p.name}
              </a>
            ))}
          </div>
        </>
      )}
    </header>
  );
}
