import React from 'react';
import Link from '@docusaurus/Link';
import projects from '../../data/projects';
import styles from './styles.module.css';

/**
 * Shared zcohen-nerd Footer (swizzled @theme/Footer replacement).
 *
 * Navy command-deck footer with the mono text wordmark (the navy PNG marks
 * disappear on a navy background, so the wordmark is rendered as text), the
 * ecosystem link column driven from the canonical registry, a Connect column,
 * and the "documented in public" amber signal dot.
 */

const CONNECT_LINKS = [
  {label: 'GitHub', href: 'https://github.com/zcohen-nerd'},
  {label: 'Email', href: 'mailto:hello@zcohen-nerd.com'},
  {label: 'RSS', href: '/blog/rss.xml'},
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <div className={styles.wordmark}>
              zcohen<span className={styles.wordmarkAccent}>-nerd</span>
            </div>
            <p className={styles.tagline}>
              Practical engineering, systems thinking, and modern literacy —
              documented in public.
            </p>
          </div>

          <div className={styles.linkCols}>
            <div className={styles.linkCol}>
              <div className={styles.colHeading}>Ecosystem</div>
              <div className={styles.linkList}>
                {projects.map((p) => (
                  <Link key={p.name} to={p.href} className={styles.footerLink}>
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.linkCol}>
              <div className={styles.colHeading}>Connect</div>
              <div className={styles.linkList}>
                {CONNECT_LINKS.map((l) => (
                  <a key={l.label} href={l.href} className={styles.footerLink}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>© 2026 zcohen-nerd</div>
          <div className={styles.signal}>
            <span className={styles.signalDot} aria-hidden="true" />
            documented in public
          </div>
        </div>
      </div>
    </footer>
  );
}
