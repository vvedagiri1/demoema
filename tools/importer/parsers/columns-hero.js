/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-hero. Base: columns.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-14
 *
 * Columns block (core/franklin/components/columns). Per field-hinting rules,
 * Columns blocks do NOT use field comments — cells hold default content only.
 * Structure: 1 content row, 2 columns.
 *   - Col 1: heading + subheading + CTA buttons
 *   - Col 2: image collage
 */
export default function parse(element, { document }) {
  // Direct children of the grid are the columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Text column: the one containing a heading
  const textCol = columns.find((c) => c.querySelector('h1, h2, h3, [class*="heading"]'));
  // Media column: the one containing images
  const mediaCol = columns.find((c) => c.querySelector('img'));

  const leftCell = [];
  if (textCol) {
    const heading = textCol.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = textCol.querySelector('p, .subheading, [class*="subheading"]');
    const ctas = Array.from(textCol.querySelectorAll('a.button, a[class*="button"], .button-group a'));
    if (heading) leftCell.push(heading);
    if (subheading) leftCell.push(subheading);
    leftCell.push(...ctas);
  }

  const rightCell = [];
  if (mediaCol) {
    const images = Array.from(mediaCol.querySelectorAll('img'));
    rightCell.push(...images);
  }

  // Empty-block guard
  if (leftCell.length === 0 && rightCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([leftCell, rightCell]); // 2-column content row

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-hero', cells });
  element.replaceWith(block);
}
