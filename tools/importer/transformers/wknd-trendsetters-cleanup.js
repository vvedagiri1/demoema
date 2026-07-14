/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 *
 * All selectors below were verified against migration-work/cleaned.html for
 * https://wknd-trendsetters.site/ — none are guessed.
 *
 * Removes non-authorable site chrome and decorative artifacts so the import
 * contains only page-level authorable content:
 *  - Skip link (`a.skip-link`) — accessibility shortcut, not authored.
 *  - Navbar (`div.navbar`) — auto-populated by the EDS header block.
 *  - Footer (`footer.footer`) — auto-populated by the EDS footer block.
 *  - Breadcrumbs (`div.breadcrumbs`) — non-authorable navigation.
 *  - Decorative inline SVG icons encoded as `<img src="data:...base64,...">`
 *    (nav carets/logos, mega-menu icons, FAQ +/- icons, footer social icons,
 *    breadcrumb chevrons). These are presentational glyphs, not content.
 *  - `data-astro-cid-*` framework attributes left by the Astro build.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (auto-populated by header/footer blocks) and
    // non-authorable navigation. Selectors verified in cleaned.html.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer',
      'div.breadcrumbs',
    ]);

    // Decorative inline SVG / base64 icons: <img src="data:...">.
    // Verified in cleaned.html (nav, mega-menu, FAQ, footer, breadcrumbs).
    element.querySelectorAll('img[src^="data:"]').forEach((img) => img.remove());

    // Strip Astro framework attributes (e.g. data-astro-cid-37fxchfa on <body>).
    // Verified in cleaned.html.
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-cid-')) {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
