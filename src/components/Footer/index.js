import React from 'react';
import {useDocusaurusContext} from '@docusaurus/core';
import projects from '../../data/projects';
import styles from './styles.module.css';

/**
 * Shared zcohen-nerd Footer (swizzled @theme/Footer replacement).
 *
 * Reads siteConfig.customFields.brand for project-aware configuration.
 * - Ecosystem column: driven by the canonical project registry (absolute URLs).
 * - Connect column: uses brand.connectLinks (configurable per site).
 * - Brand column tagline: uses brand.attribution (hub tagline or project attribution).
 *
 * Set in docusaurus.config.ts:
 *   customFields: { brand: { isHub: false, attribution: 'A zcohen-nerd technical guide by Zac Cohen.', connectLinks: [...] } }
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

export default function Footer() {
  const {siteConfig} = useDocusaurusContext();
  const brand = {...DEFAULT_BRAND, ...siteConfig.customFields?.brand};

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <div className={styles.wordmark}>
              zcohen<span className={styles.wordmarkAccent}>-nerd</span>
            </div>
            <p className={styles.tagline}>
              {brand.attribution}
            </p>
          </div>

          <div className={styles.linkCols}>
            <div className={styles.linkCol}>
              <div className={styles.colHeading}>Ecosystem</div>
              <div className={styles.linkList}>
                {projects.map((p) => (
                  <a key={p.name} href={p.href} className={styles.footerLink}>
                    {p.name}
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.linkCol}>
              <div className={styles.colHeading}>Connect</div>
              <div className={styles.linkList}>
                {brand.connectLinks.map((l) => (
                  <a key={l.label} href={l.href} className={styles.footerLink}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>© {new Date().getFullYear()} zcohen-nerd</div>
          <div className={styles.signal}>
            <span className={styles.signalDot} aria-hidden="true" />
            documented in public
          </div>
        </div>
      </div>
    </footer>
  );
}
