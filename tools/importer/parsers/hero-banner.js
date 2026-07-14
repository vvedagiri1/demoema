/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero (simple block).
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-14
 *
 * Hero block: 1 column, up to 3 rows (block name + image row + content row).
 *   - Row 2 (field:image): background image (imageAlt collapses to alt attr, no hint)
 *   - Row 3 (field:text): heading + subheading + CTA (grouped rich text)
 * Single-column: each row is ONE cell holding all its elements.
 */
export default function parse(element, { document }) {
  const image = element.querySelector('img[class*="cover"], img[class*="overlay"], img');
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
  const ctas = Array.from(element.querySelectorAll('a.button, a[class*="button"], .button-group a'));

  // Empty-block guard
  if (!image && !heading && !subheading && ctas.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (single cell)
  if (image) {
    cells.push([[document.createComment(' field:image '), image]]);
  }

  // Row 3: text content (single cell holding heading, subheading, CTAs)
  const contentCell = [document.createComment(' field:text ')];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctas);
  if (contentCell.length > 1) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
