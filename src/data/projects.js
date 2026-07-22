/**
 * Canonical project registry for the zcohen-nerd ecosystem.
 *
 * This is the single source of truth for "what projects exist." It drives:
 *   - the Projects ▾ switcher disclosure in the shared Navbar (grouped)
 *   - the mobile drawer project list (grouped)
 *   - the Ecosystem column in the shared Footer
 *   - the hub landing page sections (Featured destinations / Tools & projects)
 *
 * Adding a project to the whole ecosystem = one entry here.
 *
 * Each entry:
 *   name      — display name
 *   href      — destination (absolute URL)
 *   emoji     — project icon (native emoji, not an icon font)
 *   blurb     — one-line description shown on the card
 *   category  — 'destination' (major property people visit) or
 *               'tool' (installable/open engineering tooling) or
 *               'project' (a documented hardware/engineering system)
 *   featured  — true for the hub's "Start here" destinations section
 *   order     — ascending sort key; defines canonical display order
 *   status    — { label, color, bg } pill (color/bg are literal so each
 *               project keeps its own signal even off the parent theme)
 *   accent    — top-border color of the card (the project's signature color)
 *   accentTint— icon-tile background (a light wash of the accent)
 *   accentSoft— border color on hover (a mid tint of the accent)
 *   enterColor— color of the "Enter →" link
 */

const STATUS_LIVE = {
  label: 'Live',
  color: '#2e8555',
  bg: 'rgba(46,133,85,.1)',
};

const STATUS_IN_PROGRESS = {
  label: 'In progress',
  color: '#b06f00',
  bg: 'rgba(176,111,0,.12)',
};

const STATUS_PUBLIC_REVIEW = {
  label: 'Public Review Draft',
  color: '#b06f00',
  bg: 'rgba(176,111,0,.12)',
};

const STATUS_PUBLIC_BETA = {
  label: 'Public Beta',
  color: '#6d28d9',
  bg: 'rgba(124,58,237,.1)',
};

const CATEGORIES = ['destination', 'tool', 'project'];

const projects = [
  {
    name: 'Portfolio',
    href: 'https://portfolio.zcohen-nerd.com/',
    emoji: '⚙️',
    blurb: 'Selected work in software, hardware, and the systems that connect them.',
    category: 'destination',
    featured: true,
    order: 10,
    status: STATUS_LIVE,
    accent: '#10b8d8', // cyan-500
    accentTint: '#eaf9fc', // cyan-050
    accentSoft: '#8fdcec', // cyan-300
    enterColor: '#0b7e96', // cyan-700
  },
  {
    name: 'Literacy for Kids',
    href: 'https://www.literacy-for-kids.com/',
    emoji: '📚',
    blurb: 'Free, open curricula teaching kids 8–12 how modern systems actually work.',
    category: 'destination',
    featured: true,
    order: 20,
    status: STATUS_LIVE,
    accent: '#2e8555',
    accentTint: 'rgba(46,133,85,.1)',
    accentSoft: '#9fd3b5',
    enterColor: '#29784c',
  },
  {
    name: 'Connector Guide',
    href: 'https://zcohen-nerd.github.io/connector-engineering-field-guide/',
    emoji: '🔌',
    blurb: 'A field guide and teaching tool for professional electrical connectors.',
    category: 'destination',
    featured: true,
    order: 30,
    status: STATUS_PUBLIC_REVIEW,
    accent: '#c2410c',
    accentTint: 'rgba(194,65,12,.1)',
    accentSoft: '#e9b894',
    enterColor: '#b8460a',
  },
  {
    name: 'Writing',
    href: 'https://zcohennerd.substack.com/',
    emoji: '✍️',
    blurb: 'Essays on how good engineering scales — documentation, feedback loops, and systems that outlive their creators.',
    category: 'destination',
    featured: true,
    order: 40,
    status: STATUS_LIVE,
    accent: '#0d9488',
    accentTint: 'rgba(13,148,136,.1)',
    accentSoft: '#5eead4',
    enterColor: '#0f766e',
  },
  {
    name: 'PinmapGen',
    href: 'https://github.com/zcohen-nerd/PinmapGen',
    emoji: '📌',
    blurb: 'Turns Fusion 360 Electronics schematics into firmware-ready pinmaps, docs, and diagrams.',
    category: 'tool',
    featured: false,
    order: 50,
    status: STATUS_PUBLIC_BETA,
    accent: '#7c3aed',
    accentTint: 'rgba(124,58,237,.1)',
    accentSoft: '#c4b5fd',
    enterColor: '#6d28d9',
  },
  {
    name: 'Fusion System Blocks',
    href: 'https://github.com/zcohen-nerd/Fusion_System_Blocks',
    emoji: '🧩',
    blurb: 'A block-diagram editor inside Autodesk Fusion — plan and validate system architecture beside the CAD model.',
    category: 'tool',
    featured: false,
    order: 60,
    status: STATUS_LIVE,
    accent: '#d97706',
    accentTint: 'rgba(217,119,6,.1)',
    accentSoft: '#fcd34d',
    enterColor: '#b45309',
  },
  {
    name: 'FusionToGitHub',
    href: 'https://github.com/zcohen-nerd/FusionToGitHub',
    emoji: '🐙',
    blurb: 'One-click version control for Autodesk Fusion designs — export, commit, and branch straight to GitHub.',
    category: 'tool',
    featured: false,
    order: 70,
    status: STATUS_PUBLIC_BETA,
    accent: '#2563eb',
    accentTint: 'rgba(37,99,235,.1)',
    accentSoft: '#93c5fd',
    enterColor: '#1d4ed8',
  },
  {
    name: 'SENTRY',
    href: 'https://portfolio.zcohen-nerd.com/projects/sentry-v3/',
    emoji: '🎯',
    blurb: 'A fully automated NERF turret — a hands-on mechatronics platform for controls, sensor fusion, and system integration.',
    category: 'project',
    featured: false,
    order: 80,
    status: STATUS_LIVE,
    accent: '#e11d48',
    accentTint: 'rgba(225,29,72,.08)',
    accentSoft: '#fda4af',
    enterColor: '#be123c',
  },
];

// Canonical ordering everywhere: ascending `order`.
projects.sort((a, b) => a.order - b.order);

function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}

/**
 * getProjectsByCategory('tool') — or pass an array of categories to merge
 * groups, e.g. getProjectsByCategory(['tool', 'project']) for the hub's
 * "Engineering tools & projects" section.
 */
function getProjectsByCategory(category) {
  const wanted = Array.isArray(category) ? category : [category];
  return projects.filter((p) => wanted.includes(p.category));
}

module.exports = projects;
module.exports.projects = projects;
module.exports.CATEGORIES = CATEGORIES;
module.exports.getFeaturedProjects = getFeaturedProjects;
module.exports.getProjectsByCategory = getProjectsByCategory;
module.exports.STATUS_LIVE = STATUS_LIVE;
module.exports.STATUS_IN_PROGRESS = STATUS_IN_PROGRESS;
module.exports.STATUS_PUBLIC_REVIEW = STATUS_PUBLIC_REVIEW;
module.exports.STATUS_PUBLIC_BETA = STATUS_PUBLIC_BETA;
