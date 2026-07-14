/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion (container block).
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-14
 *
 * Container accordion block. Each FAQ item = one row with 2 columns:
 *   - Col 1 (field:summary): the question/title
 *   - Col 2 (field:text): the answer rich text
 * Source items are <details class="faq-item"> with a <summary> and .faq-answer.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details, :scope > .faq-item, details.faq-item'));

  const cells = [];
  items.forEach((item) => {
    // --- Summary cell (question) ---
    const summaryEl = item.querySelector('summary, .faq-question');
    const summaryCell = [];
    const questionText = summaryEl ? summaryEl.textContent.trim() : '';
    if (questionText) {
      summaryCell.push(document.createComment(' field:summary '));
      const p = document.createElement('p');
      p.textContent = questionText;
      summaryCell.push(p);
    }

    // --- Text cell (answer) ---
    const answerEl = item.querySelector('.faq-answer');
    const textCell = [];
    if (answerEl) {
      const answerParts = Array.from(answerEl.childNodes).filter(
        (n) => n.nodeType !== 3 || n.textContent.trim(),
      );
      if (answerParts.length) {
        textCell.push(document.createComment(' field:text '));
        textCell.push(...answerParts);
      }
    }

    cells.push([summaryCell, textCell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
