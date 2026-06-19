import React, {useState, useEffect, useRef} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebar from '@theme/Navbar/MobileSidebar';
import projects from '../../data/projects';
import DEFAULT_BRAND from '../../data/defaultBrand';
import styles from './styles.module.css';

/**
 * Shared zcohen-nerd Navbar (swizzled @theme/Navbar replacement).
 *
 * Reads siteConfig.customFields.brand for project-aware configuration.
 * Hub mode (isHub: true)      — renders brand.navLinks (Work / Writing / About).
 * Project mode (isHub: false) — renders brand.projectBadge instead of nav links.
 *
 * On mobile docs pages, renders a sidebar toggle (left of logo) that opens the
 * Docusaurus docs sidebar. The brand hamburger (right) opens the project drawer.
 * These are independent; both can be open simultaneously.
 *
 * Set in docusaurus.config.ts:
 *   customFields: { brand: { isHub: false, projectBadge: 'A zcohen-nerd technical guide', ... } }
 */

/**
 * Projects ▾ dropdown. Accepts projectUrl so it can mark the current project.
 */
function ProjectSwitcher({projectUrl}) {
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
              aria-current={p.href === projectUrl ? 'page' : undefined}
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

  // Docusaurus mobile sidebar hook (context provided by @theme/Layout/Provider).
  // disabled: true when no sidebar content exists (e.g. hub/landing pages).
  // shown: whether the sidebar panel is currently open.
  const mobileSidebar = useNavbarMobileSidebar();

  return (
    <header
      className={
        styles.header + (mobileSidebar.shown ? ' navbar-sidebar--show' : '')
      }>

      {/* Left group: sidebar toggle (mobile docs only) + logo */}
      <div className={styles.headerLeft}>
        {!mobileSidebar.disabled && (
          <button
            type="button"
            className={styles.sidebarToggle}
            aria-label="Toggle sidebar"
            aria-expanded={mobileSidebar.shown}
            onClick={mobileSidebar.toggle}>
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
          </button>
        )}
        <a href={brand.hubUrl} className={styles.logoLink} aria-label="zcohen-nerd home">
          <img className={styles.logo} src={logoUrl} alt="zcohen-nerd" />
        </a>
      </div>

      {/* Primary nav: hub links or project badge, plus Projects switcher */}
      <nav className={styles.nav} aria-label="Primary">
        {isHub
          ? brand.navLinks.map((l) => (
              <a key={l.label} href={l.href} className={styles.navLink}>
                {l.label}
              </a>
            ))
          : <span className={styles.badge}>{brand.projectBadge}</span>
        }
        <ProjectSwitcher projectUrl={brand.projectUrl} />
      </nav>

      {/* Brand mobile drawer toggle (opens project navigation) */}
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

      {/* Brand mobile drawer (nav links + project switcher) */}
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
                aria-current={p.href === brand.projectUrl ? 'page' : undefined}
                onClick={() => setDrawerOpen(false)}>
                <span aria-hidden="true">{p.emoji}</span> {p.name}
              </a>
            ))}
          </div>
        </>
      )}

      {/* Docusaurus mobile sidebar backdrop — dismisses sidebar on outside tap */}
      <div
        role="presentation"
        className="navbar-sidebar__backdrop"
        onClick={mobileSidebar.toggle}
      />

      {/* Docusaurus mobile sidebar panel (docs navigation) */}
      <NavbarMobileSidebar />
    </header>
  );
}
