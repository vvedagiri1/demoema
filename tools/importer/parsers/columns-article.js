/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-14
 *
 * Columns block (core/franklin/components/columns). Columns blocks do NOT use
 * field comments — cells hold default content only.
 * Structure: 1 content row, 2 columns.
 *   - Col 1: cover image
 *   - Col 2: breadcrumbs + heading + author/date metadata
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Media column: the one containing an image
  const mediaCol = columns.find((c) => c.querySelector('img'));
  // Text column: the first column that has no image (falls back to the non-media column)
  const textCol = columns.find((c) => c !== mediaCol);

  const leftCell = [];
  if (mediaCol) {
    const img = mediaCol.querySelector('img');
    if (img) leftCell.push(img);
  }

  const rightCell = [];
  if (textCol) {
    // Keep the full text column content (breadcrumbs, heading, metadata) as-is
    rightCell.push(...Array.from(textCol.childNodes));
  }

  // Empty-block guard
  if (leftCell.length === 0 && rightCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([leftCell, rightCell]); // 2-column content row

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
