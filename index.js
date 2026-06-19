const path = require('path');

/**
 * @zcohen-nerd/brand — Docusaurus theme plugin.
 *
 * Registering this in a site's `themes` array aliases the brand's swizzled
 * components over Docusaurus' classic theme, so every property in the
 * ecosystem renders the identical Navbar and Footer.
 *
 * The theme path points at `src/components`, so:
 *   @theme/Navbar  ->  src/components/Navbar/index.js
 *   @theme/Footer  ->  src/components/Footer/index.js
 *
 * Tokens and the Infima bridge are CSS — consume them from `custom.css`:
 *   @import '@zcohen-nerd/brand/tokens/zcohen-nerd-tokens.css';
 *   @import '@zcohen-nerd/brand/src/infima-bridge.css';
 */
module.exports = function brandTheme() {
  return {
    name: '@zcohen-nerd/brand',
    getThemePath() {
      return path.resolve(__dirname, './src/components');
    },
  };
};
