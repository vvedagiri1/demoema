/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters section breaks + section metadata.
 *
 * Template-agnostic: driven entirely by `payload.template.sections` (the
 * section descriptors in tools/importer/page-templates.json). For the
 * home-page template this yields 7 sections, 3 of which carry a `style`
 * ("secondary"), so it produces 6 <hr> section breaks and 3 Section
 * Metadata blocks.
 *
 * Each section descriptor provides a DOM `selector` (verified against
 * migration-work/cleaned.html) used to locate the section's root element
 * under `main`. Runs in afterTransform only — after block parsers have
 * built their tables, so inserted <hr>/metadata sit at section boundaries.
 *
 * Sections are processed in reverse order so earlier insertions never shift
 * the reference nodes of later ones.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve each section's root element via its DOM selector, keeping the
  // template order. Selectors come from page-templates.json (captured DOM).
  const resolved = sections.map((section) => {
    let el = null;
    if (section.selector) {
      try {
        el = element.querySelector(section.selector) || doc.querySelector(section.selector);
      } catch (e) {
        el = null;
      }
    }
    return { section, el };
  });

  // Process in reverse so insertions don't invalidate earlier reference nodes.
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { section, el } = resolved[i];
    if (!el || !el.parentNode) continue;

    // Section Metadata block, when the section declares a style. Inserted
    // after the section content so it belongs to that section.
    if (section.style) {
      const block = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (el.nextSibling) {
        el.parentNode.insertBefore(block, el.nextSibling);
      } else {
        el.parentNode.appendChild(block);
      }
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      el.parentNode.insertBefore(hr, el);
    }
  }
}
