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
  hubUrl: 'https://www.zcohen-nerd.com',
  projectUrl: 'https://www.zcohen-nerd.com',
  repoUrl: 'https://github.com/zcohen-nerd',
  attribution:
    'Practical engineering, systems thinking, and modern literacy — documented in public.',
  isHub: true,
  navLinks: [
    {label: 'Work', href: 'https://zcohen-nerd.github.io/Portfolio/'},
    {label: 'Writing', href: 'https://www.linkedin.com/in/zachary-cohen-nerd/recent-activity/articles/'},
    {label: 'About', href: '/about'},
  ],
  connectLinks: [
    {label: 'GitHub', href: 'https://github.com/zcohen-nerd'},
    {label: 'Email', href: 'mailto:hello@zcohen-nerd.com'},
  ],
};

module.exports = DEFAULT_BRAND;
