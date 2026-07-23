import React, {useState, useEffect, useRef, useCallback} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebar from '@theme/Navbar/MobileSidebar';
import projects from '../../data/projects';
import DEFAULT_BRAND from '../../data/defaultBrand';

// Registry-driven navigation groups: featured destinations first, then
// everything else (tools + documented projects), both in registry order.
const NAV_GROUPS = [
  {label: 'Featured destinations', items: projects.filter((p) => p.featured)},
  {label: 'Tools & projects', items: projects.filter((p) => !p.featured)},
].filter((g) => g.items.length > 0);
import {isExternalUrl} from '../../utils/isExternal';
import styles from './styles.module.css';

/**
 * Shared zcohen-nerd Navbar (swizzled @theme/Navbar replacement).
 *
 * Reads siteConfig.customFields.brand for project-aware configuration.
 * Hub mode (isHub: true)      — renders brand.navLinks (Work / Writing / About).
 * Project mode (isHub: false) — renders brand.projectBadge instead of nav links.
 *
 * Accessibility contract:
 * - The Ecosystem switcher is a disclosure (aria-expanded + aria-controls),
 *   not an ARIA menu. Its link list is ALWAYS present in server-rendered
 *   HTML (hidden with the `hidden` attribute when closed) so crawlers and
 *   no-JS visitors can still discover every project link.
 * - The mobile drawer is a dialog (aria-modal) with focus trap, Escape to
 *   close, focus return to the trigger, and body scroll lock. Its content
 *   is also always present in server-rendered HTML.
 * - External links (outside the zcohen-nerd.com family) carry a visible ↗
 *   plus screen-reader text.
 *
 * On mobile docs pages, renders a sidebar toggle (left of logo) that opens the
 * Docusaurus docs sidebar. The brand hamburger (right) opens the project drawer.
 * These are independent; both can be open simultaneously.
 */

function ExternalMark() {
  return (
    <>
      {' '}
      <span aria-hidden="true">↗</span>
      <span className={styles.srOnly}>(opens external site)</span>
    </>
  );
}

const DISCLOSURE_ID = 'zc-project-disclosure';
const DRAWER_ID = 'zc-mobile-drawer';

/**
 * Ecosystem disclosure — the shared cross-site switcher listing every
 * zcohen-nerd destination, tool, and system. Accepts projectUrl so it can
 * mark the current property. The panel is rendered unconditionally;
 * `hidden` controls visibility.
 */
function EcosystemSwitcher({projectUrl}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  const close = useCallback((refocus) => {
    setOpen(false);
    if (refocus) {
      triggerRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    function onClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        close(false);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        close(true);
      }
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <div className={styles.switcher} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.switcherPill}
        aria-expanded={open}
        aria-controls={DISCLOSURE_ID}
        onClick={() => setOpen((v) => !v)}>
        Ecosystem <span className={styles.caret} aria-hidden="true">▾</span>
      </button>
      <div id={DISCLOSURE_ID} className={styles.dropdown} hidden={!open}>
        {NAV_GROUPS.map((group) => (
          <React.Fragment key={group.label}>
            <div className={styles.dropdownGroupLabel}>{group.label}</div>
            {group.items.map((p) => (
              <a
                key={p.name}
                href={p.href}
                className={styles.dropdownItem}
                aria-current={p.href === projectUrl ? 'page' : undefined}
                onClick={() => close(false)}>
                <span className={styles.dropdownEmoji} aria-hidden="true">
                  {p.emoji}
                </span>
                <span className={styles.dropdownName}>
                  {p.name}
                  {isExternalUrl(p.href) && <ExternalMark />}
                </span>
              </a>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const {siteConfig} = useDocusaurusContext();
  const brand = {...DEFAULT_BRAND, ...siteConfig.customFields?.brand};
  const isHub = brand.isHub ?? true;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const drawerTriggerRef = useRef(null);
  const logoUrl = useBaseUrl('/img/zcohen-nerd-logo.png');

  // Docusaurus mobile sidebar hook (context provided by @theme/Layout/Provider).
  // disabled: true when no sidebar content exists (e.g. hub/landing pages).
  // shown: whether the sidebar panel is currently open.
  const mobileSidebar = useNavbarMobileSidebar();

  const closeDrawer = useCallback((refocus) => {
    setDrawerOpen(false);
    if (refocus) {
      drawerTriggerRef.current?.focus();
    }
  }, []);

  // Drawer open: lock body scroll and move focus to the first link.
  useEffect(() => {
    if (!drawerOpen) {
      return undefined;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = drawerRef.current?.querySelector('a[href], button');
    first?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [drawerOpen]);

  // Drawer keyboard behavior: Escape closes; Tab is trapped inside.
  function onDrawerKeyDown(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeDrawer(true);
      return;
    }
    if (e.key !== 'Tab') {
      return;
    }
    const focusables = drawerRef.current?.querySelectorAll(
      'a[href], button:not([disabled])',
    );
    if (!focusables || focusables.length === 0) {
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function renderNavLink(l, className, onClick) {
    return (
      <a key={l.label} href={l.href} className={className} onClick={onClick}>
        {l.label}
        {isExternalUrl(l.href) && <ExternalMark />}
      </a>
    );
  }

  // Wrapper receives navbar-sidebar--show so the sidebar panel (.navbar-sidebar)
  // and backdrop are rendered OUTSIDE the <header> element. This prevents
  // backdrop-filter on the header from creating a CSS containing block for
  // those position:fixed children (which would clamp their height to 59px).
  return (
    <div className={mobileSidebar.shown ? 'navbar-sidebar--show' : undefined}>
    <header className={'navbar ' + styles.header}>

      {/* Left group: sidebar toggle (mobile docs only) + logo */}
      <div className={styles.headerLeft}>
        {!mobileSidebar.disabled && (
          <button
            type="button"
            className={styles.sidebarToggle}
            aria-label="Toggle docs sidebar"
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
          ? brand.navLinks.map((l) => renderNavLink(l, styles.navLink))
          : <span className={styles.badge}>{brand.projectBadge}</span>
        }
        <EcosystemSwitcher projectUrl={brand.projectUrl} />
      </nav>

      {/* Brand mobile drawer toggle (opens project navigation) */}
      <button
        type="button"
        ref={drawerTriggerRef}
        className={styles.menuToggle}
        aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={drawerOpen}
        aria-controls={DRAWER_ID}
        onClick={() => (drawerOpen ? closeDrawer(true) : setDrawerOpen(true))}>
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
      </button>

      {/* Scrim (presentation only; rendered while open) */}
      {drawerOpen && (
        <div
          className={styles.scrim}
          onClick={() => closeDrawer(true)}
          aria-hidden="true"
        />
      )}

      {/* Brand mobile drawer (nav links + project switcher). Always present
          in the HTML so links survive without JavaScript; `hidden` gates
          visibility. */}
      <div
        id={DRAWER_ID}
        ref={drawerRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!drawerOpen}
        onKeyDown={onDrawerKeyDown}>
        {isHub
          ? brand.navLinks.map((l) =>
              renderNavLink(l, styles.drawerLink, () => closeDrawer(false)),
            )
          : <span className={styles.drawerBadge}>{brand.projectBadge}</span>
        }
        {NAV_GROUPS.map((group) => (
          <React.Fragment key={group.label}>
            <div className={styles.drawerHeading}>{group.label}</div>
            {group.items.map((p) => (
              <a
                key={p.name}
                href={p.href}
                className={styles.drawerLink}
                aria-current={p.href === brand.projectUrl ? 'page' : undefined}
                onClick={() => closeDrawer(false)}>
                <span aria-hidden="true">{p.emoji}</span> {p.name}
                {isExternalUrl(p.href) && <ExternalMark />}
              </a>
            ))}
          </React.Fragment>
        ))}
      </div>

    </header>

    {/* Sidebar backdrop and panel are siblings to <header>, NOT children.
        This keeps them outside the backdrop-filter containing block so their
        position:fixed sizing is relative to the viewport, not the navbar. */}
    <div
      role="presentation"
      className="navbar-sidebar__backdrop"
      onClick={mobileSidebar.toggle}
    />
    <NavbarMobileSidebar />
    </div>
  );
}
