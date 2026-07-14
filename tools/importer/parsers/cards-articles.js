/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-articles. Base: cards (container block).
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-14
 *
 * Container cards block. Each card = one row with 2 columns:
 *   - Col 1 (field:image): card image
 *   - Col 2 (field:text): meta (tag, date), heading, and card link (CTA)
 * Each source card is an <a class="article-card"> wrapping image + body.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > a'));

  const cells = [];
  cards.forEach((card) => {
    const href = card.getAttribute('href');

    // --- Image cell ---
    const img = card.querySelector('img');
    const imageCell = [];
    if (img) {
      imageCell.push(document.createComment(' field:image '));
      imageCell.push(img);
    }

    // --- Text cell ---
    const textCell = [];
    const textParts = [];

    // Meta line: tag + date
    const meta = card.querySelector('.article-card-meta');
    if (meta) {
      const metaP = document.createElement('p');
      metaP.textContent = Array.from(meta.querySelectorAll('span'))
        .map((s) => s.textContent.trim())
        .filter(Boolean)
        .join(' · ');
      if (metaP.textContent) textParts.push(metaP);
    }

    // Heading, linked to the card href (preserves title + CTA link)
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (heading) {
      const h = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = heading.textContent.trim();
        h.appendChild(a);
      } else {
        h.textContent = heading.textContent.trim();
      }
      textParts.push(h);
    } else if (href) {
      // No heading — fall back to a bare CTA link
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = card.textContent.trim();
      textParts.push(a);
    }

    if (textParts.length) {
      textCell.push(document.createComment(' field:text '));
      textCell.push(...textParts);
    }

    cells.push([imageCell, textCell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
