/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs (container block).
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-14
 *
 * Container tabs block. Each tab = one row with 2 columns:
 *   - Col 1: tab label       -> field:title
 *   - Col 2: tab content     -> field:content_heading, field:content_image,
 *                               field:content_richtext (grouped content_* cell)
 * content_headingType ends with "Type" -> collapsed, no hint.
 * Panes (content) are paired with tab-menu buttons (labels) by index.
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tab-pane, [role="tabpanel"]'));
  const menuButtons = Array.from(element.querySelectorAll('.tab-menu-link, [role="tab"]'));

  const cells = [];

  panes.forEach((pane, i) => {
    const button = menuButtons[i];

    // --- Tab label (col 1) ---
    // Prefer the button's primary name (first strong/paragraph) as the label.
    let labelText = '';
    if (button) {
      const nameEl = button.querySelector('strong');
      labelText = (nameEl && nameEl.textContent.trim())
        || button.textContent.trim().split('\n')[0].trim();
    }
    // Fall back to the pane's author name if the button had no label
    if (!labelText) {
      const paneName = pane.querySelector('strong');
      if (paneName) labelText = paneName.textContent.trim();
    }
    const labelCell = [];
    labelCell.push(document.createComment(' field:title '));
    const labelP = document.createElement('p');
    labelP.textContent = labelText;
    labelCell.push(labelP);

    // --- Tab content (col 2) ---
    const contentCell = [];

    // Heading = testimonial author's name (first strong in the pane)
    const nameStrong = pane.querySelector('strong');
    if (nameStrong) {
      contentCell.push(document.createComment(' field:content_heading '));
      const h3 = document.createElement('h3');
      h3.textContent = nameStrong.textContent.trim();
      contentCell.push(h3);
    }

    // Image
    const img = pane.querySelector('img');
    if (img) {
      contentCell.push(document.createComment(' field:content_image '));
      contentCell.push(img);
    }

    // Rich text = role line + quote paragraph
    const richParts = [];
    // Role: the div sibling right after the name (non-strong text block)
    const infoBlock = nameStrong ? nameStrong.closest('div').parentElement : null;
    if (infoBlock) {
      const roleDiv = Array.from(infoBlock.children).find((d) => !d.querySelector('strong') && d.textContent.trim());
      if (roleDiv) {
        const roleP = document.createElement('p');
        roleP.textContent = roleDiv.textContent.trim();
        richParts.push(roleP);
      }
    }
    const quote = pane.querySelector('p');
    if (quote) richParts.push(quote);

    if (richParts.length) {
      contentCell.push(document.createComment(' field:content_richtext '));
      contentCell.push(...richParts);
    }

    cells.push([labelCell, contentCell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
