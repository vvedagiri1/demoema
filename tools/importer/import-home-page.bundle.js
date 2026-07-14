/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home-page.js
  var import_home_page_exports = {};
  __export(import_home_page_exports, {
    default: () => import_home_page_default
  });

  // tools/importer/parsers/accordion-faq.js
  function parse(element, { document }) {
    const items = Array.from(element.querySelectorAll(":scope > details, :scope > .faq-item, details.faq-item"));
    const cells = [];
    items.forEach((item) => {
      const summaryEl = item.querySelector("summary, .faq-question");
      const summaryCell = [];
      const questionText = summaryEl ? summaryEl.textContent.trim() : "";
      if (questionText) {
        summaryCell.push(document.createComment(" field:summary "));
        const p = document.createElement("p");
        p.textContent = questionText;
        summaryCell.push(p);
      }
      const answerEl = item.querySelector(".faq-answer");
      const textCell = [];
      if (answerEl) {
        const answerParts = Array.from(answerEl.childNodes).filter(
          (n) => n.nodeType !== 3 || n.textContent.trim()
        );
        if (answerParts.length) {
          textCell.push(document.createComment(" field:text "));
          textCell.push(...answerParts);
        }
      }
      cells.push([summaryCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse2(element, { document }) {
    const cards = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link, :scope > a"));
    const cells = [];
    cards.forEach((card) => {
      const href = card.getAttribute("href");
      const img = card.querySelector("img");
      const imageCell = [];
      if (img) {
        imageCell.push(document.createComment(" field:image "));
        imageCell.push(img);
      }
      const textCell = [];
      const textParts = [];
      const meta = card.querySelector(".article-card-meta");
      if (meta) {
        const metaP = document.createElement("p");
        metaP.textContent = Array.from(meta.querySelectorAll("span")).map((s) => s.textContent.trim()).filter(Boolean).join(" \xB7 ");
        if (metaP.textContent) textParts.push(metaP);
      }
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (heading) {
        const h = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = heading.textContent.trim();
          h.appendChild(a);
        } else {
          h.textContent = heading.textContent.trim();
        }
        textParts.push(h);
      } else if (href) {
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = card.textContent.trim();
        textParts.push(a);
      }
      if (textParts.length) {
        textCell.push(document.createComment(" field:text "));
        textCell.push(...textParts);
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const imageCell = [];
      if (img) {
        imageCell.push(document.createComment(" field:image "));
        imageCell.push(img);
      }
      const textNodes = Array.from(card.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a"));
      const textCell = [];
      if (textNodes.length) {
        textCell.push(document.createComment(" field:text "));
        textCell.push(...textNodes);
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse4(element, { document }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const mediaCol = columns.find((c) => c.querySelector("img"));
    const textCol = columns.find((c) => c !== mediaCol);
    const leftCell = [];
    if (mediaCol) {
      const img = mediaCol.querySelector("img");
      if (img) leftCell.push(img);
    }
    const rightCell = [];
    if (textCol) {
      rightCell.push(...Array.from(textCol.childNodes));
    }
    if (leftCell.length === 0 && rightCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([leftCell, rightCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-hero.js
  function parse5(element, { document }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const textCol = columns.find((c) => c.querySelector('h1, h2, h3, [class*="heading"]'));
    const mediaCol = columns.find((c) => c.querySelector("img"));
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
      const images = Array.from(mediaCol.querySelectorAll("img"));
      rightCell.push(...images);
    }
    if (leftCell.length === 0 && rightCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([leftCell, rightCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse6(element, { document }) {
    const image = element.querySelector('img[class*="cover"], img[class*="overlay"], img');
    const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
    const ctas = Array.from(element.querySelectorAll('a.button, a[class*="button"], .button-group a'));
    if (!image && !heading && !subheading && ctas.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      cells.push([[document.createComment(" field:image "), image]]);
    }
    const contentCell = [document.createComment(" field:text ")];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctas);
    if (contentCell.length > 1) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse7(element, { document }) {
    const panes = Array.from(element.querySelectorAll('.tab-pane, [role="tabpanel"]'));
    const menuButtons = Array.from(element.querySelectorAll('.tab-menu-link, [role="tab"]'));
    const cells = [];
    panes.forEach((pane, i) => {
      const button = menuButtons[i];
      let labelText = "";
      if (button) {
        const nameEl = button.querySelector("strong");
        labelText = nameEl && nameEl.textContent.trim() || button.textContent.trim().split("\n")[0].trim();
      }
      if (!labelText) {
        const paneName = pane.querySelector("strong");
        if (paneName) labelText = paneName.textContent.trim();
      }
      const labelCell = [];
      labelCell.push(document.createComment(" field:title "));
      const labelP = document.createElement("p");
      labelP.textContent = labelText;
      labelCell.push(labelP);
      const contentCell = [];
      const nameStrong = pane.querySelector("strong");
      if (nameStrong) {
        contentCell.push(document.createComment(" field:content_heading "));
        const h3 = document.createElement("h3");
        h3.textContent = nameStrong.textContent.trim();
        contentCell.push(h3);
      }
      const img = pane.querySelector("img");
      if (img) {
        contentCell.push(document.createComment(" field:content_image "));
        contentCell.push(img);
      }
      const richParts = [];
      const infoBlock = nameStrong ? nameStrong.closest("div").parentElement : null;
      if (infoBlock) {
        const roleDiv = Array.from(infoBlock.children).find((d) => !d.querySelector("strong") && d.textContent.trim());
        if (roleDiv) {
          const roleP = document.createElement("p");
          roleP.textContent = roleDiv.textContent.trim();
          richParts.push(roleP);
        }
      }
      const quote = pane.querySelector("p");
      if (quote) richParts.push(quote);
      if (richParts.length) {
        contentCell.push(document.createComment(" field:content_richtext "));
        contentCell.push(...richParts);
      }
      cells.push([labelCell, contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer",
        "div.breadcrumbs"
      ]);
      element.querySelectorAll('img[src^="data:"]').forEach((img) => img.remove());
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-astro-cid-")) {
            el.removeAttribute(attr.name);
          }
        });
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
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
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      if (!el || !el.parentNode) continue;
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (el.nextSibling) {
          el.parentNode.insertBefore(block, el.nextSibling);
        } else {
          el.parentNode.appendChild(block);
        }
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        el.parentNode.insertBefore(hr, el);
      }
    }
  }

  // tools/importer/import-home-page.js
  var parsers = {
    "accordion-faq": parse,
    "cards-articles": parse2,
    "cards-gallery": parse3,
    "columns-article": parse4,
    "columns-hero": parse5,
    "hero-banner": parse6,
    "tabs-testimonial": parse7
  };
  var PAGE_TEMPLATE = {
    name: "home-page",
    description: "WKND Trendsetters home page: hero with image collage, featured article card, image gallery grid, testimonial tabs, latest articles cards, FAQ accordion, and CTA banner. Navigation and footer auto-populated.",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "columns-hero",
        instances: ["#main-content > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl"]
      },
      {
        name: "columns-article",
        instances: ["#main-content > section.section:nth-of-type(1) .grid-layout.grid-gap-lg"]
      },
      {
        name: "cards-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: ["#main-content > section.section:nth-of-type(3) .tabs-wrapper"]
      },
      {
        name: "cards-articles",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: ["#main-content > section.section:nth-of-type(5) .faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["#main-content > section.section.inverse-section .grid-layout.desktop-1-column"]
      }
    ],
    sections: [
      {
        id: "rc2",
        name: "Hero",
        selector: "#main-content > header.section.secondary-section",
        style: "secondary",
        blocks: ["columns-hero"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "Featured Article",
        selector: "#main-content > section.section:nth-of-type(1)",
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "Image Gallery",
        selector: "#main-content > section.section.secondary-section:nth-of-type(2)",
        style: "secondary",
        blocks: ["cards-gallery"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem"]
      },
      {
        id: "rc5",
        name: "Testimonials",
        selector: "#main-content > section.section:nth-of-type(3)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "rc6",
        name: "Latest Articles",
        selector: "#main-content > section.section.secondary-section:nth-of-type(4)",
        style: "secondary",
        blocks: ["cards-articles"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center"]
      },
      {
        id: "rc7",
        name: "FAQ",
        selector: "#main-content > section.section:nth-of-type(5)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: ["#main-content > section.section:nth-of-type(5) .grid-layout.grid-gap-xxl > div:first-child"]
      },
      {
        id: "rc8",
        name: "CTA Banner",
        selector: "#main-content > section.section.inverse-section",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let pathname = new URL(params.originalURL).pathname.replace(/\.html$/, "").replace(/\/$/, "");
      if (pathname === "") pathname = "/index";
      const path = WebImporter.FileUtils.sanitizePath(pathname);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_page_exports);
})();
