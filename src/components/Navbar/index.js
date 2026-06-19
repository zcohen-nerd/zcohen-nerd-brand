import React, {useState, useEffect, useRef} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import projects from '../../data/projects';
import styles from './styles.module.css';

/**
 * Shared zcohen-nerd Navbar (swizzled @theme/Navbar replacement).
 *
 * Sticky, translucent/blurred header carrying the ZN wordmark, top-level nav
 * links, and the Projects ▾ switcher — the ecosystem dropdown that is identical
 * on every property. The project list is read from the canonical registry so
 * the switcher never drifts from the grid or footer.
 */

const NAV_LINKS = [
  {label: 'Work', href: '#'},
  {label: 'Writing', href: '#'},
  {label: 'About', href: '#'},
];

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
            <Link
              key={p.name}
              to={p.href}
              className={styles.dropdownItem}
              role="menuitem"
              onClick={() => setOpen(false)}>
              <span className={styles.dropdownEmoji} aria-hidden="true">
                {p.emoji}
              </span>
              <span className={styles.dropdownName}>{p.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const logoUrl = useBaseUrl('/img/zcohen-nerd-logo.png');

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink} aria-label="zcohen-nerd home">
        <img className={styles.logo} src={logoUrl} alt="zcohen-nerd" />
      </Link>

      <nav className={styles.nav} aria-label="Primary">
        {NAV_LINKS.map((l) => (
          <a key={l.label} href={l.href} className={styles.navLink}>
            {l.label}
          </a>
        ))}
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
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={styles.drawerLink}
                onClick={() => setDrawerOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className={styles.drawerHeading}>Projects</div>
            {projects.map((p) => (
              <Link
                key={p.name}
                to={p.href}
                className={styles.drawerLink}
                onClick={() => setDrawerOpen(false)}>
                <span aria-hidden="true">{p.emoji}</span> {p.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </header>
  );
}
