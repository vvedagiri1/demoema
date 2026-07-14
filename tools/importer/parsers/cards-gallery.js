/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards (container block).
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-14
 *
 * Container cards block. Each card = one row with 2 columns:
 *   - Col 1 (field:image): card image
 *   - Col 2 (field:text): card rich text (empty here — image-only gallery)
 * xwalk: content cells carry <!-- field:name --> hints; empty cells get none.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('img');

    // Image cell with field hint
    const imageCell = [];
    if (img) {
      imageCell.push(document.createComment(' field:image '));
      imageCell.push(img);
    }

    // Text cell: gather any textual content beyond the image
    const textNodes = Array.from(card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a'));
    const textCell = [];
    if (textNodes.length) {
      textCell.push(document.createComment(' field:text '));
      textCell.push(...textNodes);
    }
    // Otherwise leave the text cell empty (no hint on empty cells)

    cells.push([imageCell, textCell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
