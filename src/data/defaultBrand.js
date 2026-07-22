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
    {label: 'Work', href: 'https://portfolio.zcohen-nerd.com/'},
    {label: 'Writing', href: 'https://zcohennerd.substack.com/'},
    {label: 'About', href: '/about'},
  ],
  connectLinks: [
    {label: 'GitHub', href: 'https://github.com/zcohen-nerd'},
    {label: 'LinkedIn', href: 'https://www.linkedin.com/in/zachary-cohen-nerd/'},
    {label: 'Email', href: 'mailto:zachary@zcohen-nerd.com'},
  ],
};

module.exports = DEFAULT_BRAND;
