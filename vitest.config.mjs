import {defineConfig} from 'vitest/config';
import {fileURLToPath} from 'node:url';
// `esbuild` is a direct devDependency (not relied on as a transitive of Vite)
// so this import resolves the same across Vitest/Vite majors.
import {transform} from 'esbuild';

// Forward slashes only — @rollup/plugin-alias (used by Vite resolve.alias)
// mangles Windows backslash replacements.
const stub = (name) =>
  fileURLToPath(new URL(`./test/stubs/${name}.js`, import.meta.url)).replace(
    /\\/g,
    '/',
  );

/**
 * We test the `src/` Navbar/Footer components directly (not the compiled `lib/`)
 * so the Docusaurus module aliases below are honoured through Vite's normal ESM
 * resolution — `lib/`'s compiled CJS runs its `require()` calls outside Vite and
 * never sees the aliases.
 *
 * Those components are JSX inside `.js` files, which they must stay for
 * Docusaurus swizzle resolution. Vite's built-in esbuild pass refuses `.js`,
 * and @vitejs/plugin-react can't be used (the repo builds with a Babel 8
 * pre-release its Babel 7 path cannot load), so this pre-plugin runs esbuild's
 * JSX transform on exactly the component sources before import analysis.
 *
 * The `.jsx` test files use Vite's default transformer with the automatic JSX
 * runtime, so they do not need a `React` import.
 */
const jsxInJs = {
  name: 'zc-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!/[\\/]src[\\/]components[\\/].+\.js(\?|$)/.test(id)) return null;
    const result = await transform(code, {
      loader: 'jsx',
      jsx: 'automatic',
      sourcemap: true,
      sourcefile: id,
    });
    return {code: result.code, map: result.map};
  },
};

export default defineConfig({
  plugins: [jsxInJs],
  // `.jsx` test files use Vite's default transformer (oxc under Vite 8) with the
  // automatic JSX runtime, so they need no `React` import.
  resolve: {
    alias: {
      '@docusaurus/useDocusaurusContext': stub('useDocusaurusContext'),
      '@docusaurus/useBaseUrl': stub('useBaseUrl'),
      '@docusaurus/theme-common/internal': stub('themeCommonInternal'),
      '@theme/Navbar/MobileSidebar': stub('MobileSidebar'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.test.{js,jsx}'],
    setupFiles: ['./test/setup.js'],
    restoreMocks: true,
  },
});
