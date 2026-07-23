/**
 * Registry validation — run with `npm run test:registry`.
 * Fails when the canonical project registry violates its invariants.
 */
const projects = require('../src/data/projects');
const {CATEGORIES} = require('../src/data/projects');

const ALLOWED_STATUS = ['Live', 'In progress', 'Public Review Draft', 'Public Beta'];
const FORBIDDEN_URLS = [
  'zcohen-nerd.github.io/Portfolio',
  'literacy-for-kids.github.io',
  'www.zcohen-nerd.com',
];

let failures = [];
const check = (name, ok, detail = '') => {
  if (!ok) failures.push(`${name}${detail ? ' — ' + detail : ''}`);
  console.log(`${ok ? '  ok' : 'FAIL'}  ${name}${!ok && detail ? ' — ' + detail : ''}`);
};

const names = projects.map((p) => p.name);
check('unique names', names.length === new Set(names).size);
check('no Surfer Fleet entry', !names.some((n) => /surfer/i.test(n)));

const orders = projects.map((p) => p.order);
check('unique order values', orders.length === new Set(orders).size);
check('sorted by order', orders.every((o, i) => i === 0 || o > orders[i - 1]));

for (const p of projects) {
  check(`${p.name}: valid URL`, /^https:\/\/[^ ]+$/.test(p.href), p.href);
  check(`${p.name}: allowed category`, CATEGORIES.includes(p.category), p.category);
  check(`${p.name}: boolean featured`, typeof p.featured === 'boolean');
  check(`${p.name}: valid status`, ALLOWED_STATUS.includes(p.status?.label), p.status?.label);
  for (const bad of FORBIDDEN_URLS) {
    check(`${p.name}: no legacy URL (${bad})`, !p.href.includes(bad));
  }
}

// Fusion System Blocks is a v0.1.x release — it must stay Public Beta.
// This guards against an accidental return to Live.
const fsb = projects.find((p) => p.name === 'Fusion System Blocks');
check('Fusion System Blocks uses Public Beta status', fsb?.status?.label === 'Public Beta', `got "${fsb?.status?.label}"`);

// Navigation grouping invariants: both groups must be non-empty and the
// shared Navbar must carry the two group labels.
check('featured group non-empty', projects.some((p) => p.featured));
check('tools/projects group non-empty', projects.some((p) => !p.featured));
const navbarSrc = require('fs').readFileSync(require('path').join(__dirname, '..', 'src', 'components', 'Navbar', 'index.js'), 'utf8');
check('Navbar has "Featured destinations" group', navbarSrc.includes('Featured destinations'));
check('Navbar has "Tools & projects" group', navbarSrc.includes('Tools & projects'));
check('Navbar disclosure labeled Ecosystem', navbarSrc.includes('Ecosystem <span'));

if (failures.length) {
  console.error(`\n${failures.length} registry validation failure(s).`);
  process.exit(1);
}
console.log('\nRegistry validation passed.');
