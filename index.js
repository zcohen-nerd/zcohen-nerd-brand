const path = require('path');

/**
 * @zcohen-nerd/brand — Docusaurus theme plugin.
 *
 * Registering this in a site's `themes` array aliases the brand's swizzled
 * components over Docusaurus' classic theme, so every property in the
 * ecosystem renders the identical Navbar and Footer.
 *
 * Points at the compiled lib/ output: webpack does not transpile JSX inside
 * node_modules, so registry consumers MUST receive compiled components.
 * (Raw src/ only ever worked for file: consumers, where the symlinked
 * source was treated as local code — 1.0.3 shipped that way and cannot
 * build from the registry.) `prepublishOnly` rebuilds lib/ on every
 * publish so the compiled output can never go stale.
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
