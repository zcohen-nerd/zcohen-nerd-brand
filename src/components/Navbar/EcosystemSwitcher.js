import React, {useState, useRef, useEffect, useCallback} from 'react';
import projects from '../../data/projects';
import {isExternalUrl} from '../../utils/isExternal';
import styles from './styles.module.css';

/**
 * Ecosystem disclosure — the shared cross-site switcher listing every
 * zcohen-nerd destination, tool, and system.
 *
 * Extracted from Navbar so its disclosure semantics (aria-expanded /
 * aria-controls, Escape-to-close, focus return, always-server-rendered link
 * list) can be unit-tested without Docusaurus theme context. Behaviour is
 * unchanged from the inline version.
 */

export const DISCLOSURE_ID = 'zc-project-disclosure';

// Registry-driven navigation groups: featured destinations first, then
// everything else (tools + documented projects), both in registry order.
export const NAV_GROUPS = [
  {label: 'Featured destinations', items: projects.filter((p) => p.featured)},
  {label: 'Tools & projects', items: projects.filter((p) => !p.featured)},
].filter((g) => g.items.length > 0);

export function ExternalMark() {
  return (
    <>
      {' '}
      <span aria-hidden="true">↗</span>
      <span className={styles.srOnly}>(opens external site)</span>
    </>
  );
}

export default function EcosystemSwitcher({projectUrl}) {
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
