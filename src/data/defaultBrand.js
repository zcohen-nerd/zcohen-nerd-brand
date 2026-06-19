/**
 * Default brand configuration for the zcohen-nerd ecosystem.
 *
 * Shared by Navbar and Footer. Consumer sites override via:
 *   customFields: { brand: { isHub: false, projectBadge: '...', ... } }
 *
 * Hub mode (isHub: true)    — renders navLinks; used by the hub landing site.
 * Project mode (isHub: false) — renders projectBadge; used by docs sites, guides, etc.
 */
const DEFAULT_BRAND = {
  projectName: 'zcohen-nerd',
  projectFamily: 'hub',
  projectBadge: 'zcohen-nerd',
  hubUrl: 'https://zcohen-nerd.github.io/',
  projectUrl: 'https://zcohen-nerd.github.io/',
  repoUrl: 'https://github.com/zcohen-nerd',
  attribution:
    'Practical engineering, systems thinking, and modern literacy — documented in public.',
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

module.exports = DEFAULT_BRAND;
