// Test stub for @docusaurus/useDocusaurusContext.
// Hub-mode brand config with one deliberately external nav link so the
// external-link announcement path is exercised.
export default function useDocusaurusContext() {
  return {
    siteConfig: {
      title: 'Test Site',
      customFields: {
        brand: {
          isHub: true,
          hubUrl: '/',
          projectUrl: 'https://portfolio.zcohen-nerd.com/',
          navLinks: [
            {label: 'Work', href: '/work'},
            {label: 'Writing', href: 'https://zcohennerd.substack.com/'},
            {label: 'About', href: '/about'},
          ],
          connectLinks: [
            {label: 'GitHub', href: 'https://github.com/zcohen-nerd'},
            {label: 'Email', href: 'mailto:zac@example.com'},
          ],
          attribution: 'Test attribution line.',
        },
      },
    },
  };
}
