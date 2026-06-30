const path = require('path');

/**
 * @zcohen-nerd/brand — Docusaurus theme plugin.
 *
 * Registering this in a site's `themes` array aliases the brand's swizzled
 * components over Docusaurus' classic theme, so every property in the
 * ecosystem renders the identical Navbar and Footer.
 *
 * Points at src/components directly — Docusaurus's own webpack pipeline
 * handles JSX compilation, so no separate build step is needed for local
 * file: consumption. The `npm run build` script (src/ → lib/) is kept for
 * future npm publishing via the `prepare` hook.
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
