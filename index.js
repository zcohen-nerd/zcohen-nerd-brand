const path = require('path');

/**
 * @zcohen-nerd/brand — Docusaurus theme plugin.
 *
 * Registering this in a site's `themes` array aliases the brand's swizzled
 * components over Docusaurus' classic theme, so every property in the
 * ecosystem renders the identical Navbar and Footer.
 *
 * The theme path points at `lib/components` (compiled from `src/`):
 *   @theme/Navbar  ->  lib/components/Navbar/index.js
 *   @theme/Footer  ->  lib/components/Footer/index.js
 *
 * Run `npm run build` to recompile src/ → lib/ after any source changes.
 *
 * Tokens and the Infima bridge are CSS — consume them from `custom.css`:
 *   @import '@zcohen-nerd/brand/tokens/zcohen-nerd-tokens.css';
 *   @import '@zcohen-nerd/brand/src/infima-bridge.css';
 */
module.exports = function brandTheme() {
  return {
    name: '@zcohen-nerd/brand',
    getThemePath() {
      return path.resolve(__dirname, './lib/components');
    },
  };
};
