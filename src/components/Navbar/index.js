import React, {useState, useEffect, useRef, useCallback} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebar from '@theme/Navbar/MobileSidebar';
import DEFAULT_BRAND from '../../data/defaultBrand';
import {isExternalUrl} from '../../utils/isExternal';
import {nextTrapTarget, getFocusable} from './focusTrap';
import EcosystemSwitcher, {
  NAV_GROUPS,
  DISCLOSURE_ID,
  ExternalMark,
} from './EcosystemSwitcher';
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
 * - The mobile drawer is a dialog (aria-modal) with a visible close control,
 *   focus trap, Escape to close, focus return to the trigger, and body scroll
 *   lock. Its content is also always present in server-rendered HTML.
 * - External links (outside the zcohen-nerd.com family) carry a visible ↗
 *   plus screen-reader text.
 *
 * On mobile docs pages, renders a sidebar toggle (left of logo) that opens the
 * Docusaurus docs sidebar. The brand hamburger (right) opens the project drawer.
 * These are independent; both can be open simultaneously.
 *
 * Discrete controls (toggles, disclosure trigger, drawer/dropdown links, logo)
 * present a >=44x44 CSS-px hit area; visual density is held by trimming header
 * padding, not by enlarging text. Inline prose links are unaffected.
 */

const DRAWER_ID = 'zc-mobile-drawer';

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

  // Drawer open: lock body scroll and move focus to the first control.
  useEffect(() => {
    if (!drawerOpen) {
      return undefined;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    getFocusable(drawerRef.current)[0]?.focus();
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
    const target = nextTrapTarget(
      drawerRef.current,
      document.activeElement,
      e.shiftKey,
    );
    if (target) {
      e.preventDefault();
      target.focus();
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
              onClick={mobileSidebar.toggle}
            >
              <span className={styles.menuBar} />
              <span className={styles.menuBar} />
              <span className={styles.menuBar} />
            </button>
          )}
          <a
            href={brand.hubUrl}
            className={styles.logoLink}
            aria-label="zcohen-nerd home"
          >
            <img className={styles.logo} src={logoUrl} alt="zcohen-nerd" />
          </a>
        </div>

        {/* Primary nav: hub links or project badge, plus Ecosystem switcher */}
        <nav className={styles.nav} aria-label="Primary">
          {isHub ? (
            brand.navLinks.map((l) => renderNavLink(l, styles.navLink))
          ) : (
            <span className={styles.badge}>{brand.projectBadge}</span>
          )}
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
          onClick={() => (drawerOpen ? closeDrawer(true) : setDrawerOpen(true))}
        >
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
          onKeyDown={onDrawerKeyDown}
        >
          <button
            type="button"
            className={styles.drawerClose}
            aria-label="Close menu"
            onClick={() => closeDrawer(true)}
          >
            <span aria-hidden="true">×</span>
          </button>
          {isHub ? (
            brand.navLinks.map((l) =>
              renderNavLink(l, styles.drawerLink, () => closeDrawer(false)),
            )
          ) : (
            <span className={styles.drawerBadge}>{brand.projectBadge}</span>
          )}
          {NAV_GROUPS.map((group) => (
            <React.Fragment key={group.label}>
              <div className={styles.drawerHeading}>{group.label}</div>
              {group.items.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  className={styles.drawerLink}
                  aria-current={
                    p.href === brand.projectUrl ? 'page' : undefined
                  }
                  onClick={() => closeDrawer(false)}
                >
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
