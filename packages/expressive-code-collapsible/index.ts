import { definePlugin } from "@expressive-code/core";
import { h } from "@expressive-code/core/hast";
import { resolveOptions, countLines, shouldCollapse as checkShouldCollapse } from "./src/utils";
import type { PluginCollapsibleOptions } from "./src/types";
export type { PluginCollapsibleOptions } from "./src/types";

export function pluginCollapsible(options: PluginCollapsibleOptions = {}) {
  const config = resolveOptions(options);

  return definePlugin({
    name: "Collapsible Code Blocks",
    baseStyles: `
      .ec-collapse {
        position: relative;
      }

      .ec-collapse__content {
        position: relative;
      }

      .ec-collapse.ec-collapse--collapsed .ec-collapse__content {
        max-height: var(--ec-collapse-preview-height, 280px);
        overflow: hidden;
      }

      .ec-collapse.ec-collapse--expanded .ec-collapse__content {
        max-height: none;
      }

      .ec-collapse__gradient {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 80px;
        background: linear-gradient(
          to bottom,
          transparent 0%,
          var(--ec-collapse-bg-color, #020110) 100%
        );
        pointer-events: none;
        opacity: 1;
        transition: opacity 0.3s ease;
        z-index: 10;
      }

      .ec-collapse.ec-collapse--expanded .ec-collapse__gradient {
        opacity: 0;
        pointer-events: none;
      }

      .ec-collapse__toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin: 0 auto;
        padding: 6px 16px;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        color: var(--sl-color-accent, #3b82f6);
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;
      }

      .ec-collapse.ec-collapse--collapsed .ec-collapse__toggle {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 20;
        margin: 0;
      }

      .ec-collapse.ec-collapse--expanded .ec-collapse__toggle {
        position: relative;
        margin: 12px auto;
      }

      .ec-collapse__toggle:hover {
        background-color: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
      }

      .ec-collapse__toggle:focus-visible {
        outline: 2px solid var(--sl-color-accent, #3b82f6);
        outline-offset: 2px;
      }

      .ec-collapse__icon {
        transition: transform 0.3s ease;
      }

      .ec-collapse.ec-collapse--expanded .ec-collapse__icon {
        transform: rotate(180deg);
      }

      .ec-collapse__text-collapse {
        display: none;
      }

      .ec-collapse.ec-collapse--expanded .ec-collapse__text-expand {
        display: none;
      }

      .ec-collapse.ec-collapse--expanded .ec-collapse__text-collapse {
        display: inline;
      }

      :root[data-theme="light"] .ec-collapse__gradient {
        background: linear-gradient(
          to bottom,
          transparent 0%,
          var(--ec-collapse-bg-color, #f6f7f9) 100%
        );
      }

      :root[data-theme="light"] .ec-collapse__toggle {
        background-color: rgba(0, 0, 0, 0.05);
        border-color: rgba(0, 0, 0, 0.15);
      }

      :root[data-theme="light"] .ec-collapse__toggle:hover {
        background-color: rgba(0, 0, 0, 0.08);
        border-color: rgba(0, 0, 0, 0.25);
      }

      /* Header toggle button (in frame header) */
      .ec-collapse .frame .header,
      .ec-collapse .frame figcaption {
        display: flex !important;
        align-items: center;
        justify-content: flex-start !important;
      }

      .ec-collapse .frame.is-terminal .header .title {
        flex: 1;
        text-align: center;
      }

      .ec-collapse__header-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        margin-inline-start: auto;
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
        font-weight: 400;
        background: transparent;
        border: none;
        color: inherit;
        opacity: 1;
        cursor: pointer;
        transition: opacity 0.2s ease;
        white-space: nowrap;
      }

      .ec-collapse__header-toggle:hover {
        opacity: 0.7;
      }

      .ec-collapse__header-toggle:focus-visible {
        opacity: 1;
        outline: 2px solid currentColor;
        outline-offset: 2px;
        border-radius: 2px;
      }

      .ec-collapse__header-icon {
        transition: transform 0.2s ease;
      }

      .ec-collapse--expanded .ec-collapse__header-icon {
        transform: rotate(180deg);
      }

      .ec-collapse--collapsed .ec-collapse__header-toggle .ec-collapse__text-expand {
        display: inline;
      }
      .ec-collapse--collapsed .ec-collapse__header-toggle .ec-collapse__text-collapse {
        display: none;
      }
      .ec-collapse--expanded .ec-collapse__header-toggle .ec-collapse__text-expand {
        display: none;
      }
      .ec-collapse--expanded .ec-collapse__header-toggle .ec-collapse__text-collapse {
        display: inline;
      }

      /* Reduced motion preference */
      @media (prefers-reduced-motion: reduce) {
        .ec-collapse__gradient,
        .ec-collapse__toggle,
        .ec-collapse__icon,
        .ec-collapse__header-toggle,
        .ec-collapse__header-icon {
          transition: none;
        }
      }
    `,
    hooks: {
      postprocessRenderedBlock: async (context) => {
        const forceCollapse = context.codeBlock.metaOptions.getBoolean("collapse");
        const forceNoCollapse = context.codeBlock.metaOptions.getBoolean("nocollapse");

        const code = context.codeBlock.code;
        const lineCount = countLines(code);

        const shouldCollapseBlock = checkShouldCollapse(
          lineCount,
          config.lineThreshold,
          forceCollapse,
          forceNoCollapse
        );

        if (!shouldCollapseBlock) return;

        const blockId = `collapse-${Math.random().toString(36).substr(2, 9)}`;

        // Overlay toggle button (bottom of code block)
        const toggleButton = h(
          "button",
          {
            class: "ec-collapse__toggle",
            type: "button",
            "aria-expanded": config.defaultCollapsed ? "false" : "true",
            "aria-controls": blockId,
          },
          [
            h("span", { class: "ec-collapse__text-expand" }, config.expandButtonText),
            h("span", { class: "ec-collapse__text-collapse" }, config.collapseButtonText),
            h(
              "svg",
              {
                class: "ec-collapse__icon",
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                "aria-hidden": "true",
              },
              [
                h("path", {
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M6 9l6 6 6-6",
                }),
              ]
            ),
          ]
        );

        // Header toggle button (in frame header, with icon)
        const headerToggleButton = h(
          "button",
          {
            class: "ec-collapse__header-toggle",
            type: "button",
            "aria-expanded": config.defaultCollapsed ? "false" : "true",
            "aria-controls": blockId,
          },
          [
            h("span", { class: "ec-collapse__text-expand" }, config.expandButtonText),
            h("span", { class: "ec-collapse__text-collapse" }, config.collapseButtonText),
            h(
              "svg",
              {
                class: "ec-collapse__header-icon",
                xmlns: "http://www.w3.org/2000/svg",
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                "aria-hidden": "true",
              },
              [
                h("path", {
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M6 9l6 6 6-6",
                }),
              ]
            ),
          ]
        );

        const gradientOverlay = h("div", { class: "ec-collapse__gradient", "aria-hidden": "true" });

        const ast = context.renderData.blockAst;

        // After plugin-frames runs, blockAst IS the figure element
        // Check if ast itself is the figure, or if it's inside children
        let figureElement: typeof ast | null = null;
        let isAstTheFigure = false;

        if (ast.type === "element" && ast.tagName === "figure") {
          // blockAst IS the figure (common after plugin-frames)
          figureElement = ast;
          isAstTheFigure = true;
        } else if (ast.children) {
          // Look for figure in children
          const found = ast.children.find(
            (child) => child.type === "element" && child.tagName === "figure"
          );
          if (found && found.type === "element") {
            figureElement = found;
          }
        }

        if (figureElement && figureElement.type === "element") {
          // Build wrapper classes
          const wrapperClasses = ["ec-collapse"];
          if (config.defaultCollapsed) {
            wrapperClasses.push("ec-collapse--collapsed");
          } else {
            wrapperClasses.push("ec-collapse--expanded");
          }

          // Check if figure has a frame (has-title or is-terminal class)
          const figureClasses = figureElement.properties?.className;
          const classArray = Array.isArray(figureClasses)
            ? figureClasses
            : typeof figureClasses === "string"
              ? [figureClasses]
              : [];
          const hasFrame = classArray.some(
            (c) => typeof c === "string" && (c === "has-title" || c === "is-terminal")
          );

          // If has frame, find the header (figcaption) and insert header toggle button
          if (hasFrame && figureElement.children) {
            const headerElement = figureElement.children.find(
              (child) => child.type === "element" && child.tagName === "figcaption"
            );
            if (headerElement && headerElement.type === "element" && headerElement.children) {
              headerElement.children.push(headerToggleButton);
            }
          }

          // Create content wrapper (contains figure + gradient, has overflow control)
          const contentWrapper = h(
            "div",
            { class: "ec-collapse__content" },
            [figureElement, gradientOverlay]
          );

          // Create outer wrapper (contains content + button, button stays visible)
          const outerWrapper = h(
            "div",
            {
              class: wrapperClasses.join(" "),
              id: blockId,
              "data-collapse-preview-lines": config.previewLines.toString(),
            },
            [contentWrapper, toggleButton]
          );

          // Replace in AST
          if (isAstTheFigure) {
            // Replace the entire blockAst
            context.renderData.blockAst = outerWrapper;
          } else if (ast.children) {
            // Replace the figure in children
            const figureIndex = ast.children.indexOf(figureElement);
            if (figureIndex !== -1) {
              ast.children[figureIndex] = outerWrapper;
            }
          }
        }
      },
    },
    jsModules: [
      `
      (function() {
        'use strict';

        if (window.ecCollapsibleInit) return;
        window.ecCollapsibleInit = true;

        const LINE_HEIGHT_PX = 16 * 0.9 * 1.5;
        const BASE_PADDING = 56;

        // Create live region for screen reader announcements
        function getOrCreateLiveRegion() {
          let liveRegion = document.getElementById('ec-collapse-live-region');
          if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'ec-collapse-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
            document.body.appendChild(liveRegion);
          }
          return liveRegion;
        }

        function announceStateChange(isExpanded) {
          const liveRegion = getOrCreateLiveRegion();
          liveRegion.textContent = isExpanded ? 'Code block expanded' : 'Code block collapsed';
          // Clear after announcement to allow repeated announcements
          setTimeout(() => { liveRegion.textContent = ''; }, 1000);
        }

        function calcPreviewHeight(lines) {
          return (lines * LINE_HEIGHT_PX) + BASE_PADDING;
        }

        function toggleCollapse(frame, btn) {
          const isCollapsed = frame.classList.contains('ec-collapse--collapsed');
          const newState = isCollapsed ? 'expanded' : 'collapsed';

          if (isCollapsed) {
            frame.classList.remove('ec-collapse--collapsed');
            frame.classList.add('ec-collapse--expanded');
          } else {
            frame.classList.remove('ec-collapse--expanded');
            frame.classList.add('ec-collapse--collapsed');

            const rect = frame.getBoundingClientRect();
            if (rect.top < 0) {
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              frame.scrollIntoView({ behavior: prefersReducedMotion ? 'instant' : 'smooth', block: 'start' });
            }
          }

          // Update aria-expanded on ALL toggle buttons in this frame
          const allButtons = frame.querySelectorAll('.ec-collapse__toggle, .ec-collapse__header-toggle');
          allButtons.forEach(b => b.setAttribute('aria-expanded', newState === 'expanded' ? 'true' : 'false'));

          // Announce state change to screen readers
          announceStateChange(newState === 'expanded');
        }

        function initCollapseButtons() {
          // Initialize both overlay and header toggle buttons
          document.querySelectorAll('.ec-collapse__toggle, .ec-collapse__header-toggle').forEach(btn => {
            if (btn.dataset.init) return;
            btn.dataset.init = 'true';

            const frame = btn.closest('.ec-collapse');
            if (!frame) return;

            // Set preview height (only needs to be done once per frame)
            if (!frame.dataset.heightInit) {
              frame.dataset.heightInit = 'true';
              const previewLines = parseInt(frame.dataset.collapsePreviewLines || '8', 10);
              frame.style.setProperty('--ec-collapse-preview-height', calcPreviewHeight(previewLines) + 'px');
            }

            btn.addEventListener('click', (e) => {
              e.preventDefault();
              toggleCollapse(frame, btn);
            });
          });
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initCollapseButtons);
        } else {
          initCollapseButtons();
        }

        new MutationObserver(() => {
          initCollapseButtons();
        }).observe(document.body, { childList: true, subtree: true });
      })();
      `,
    ],
  });
}

export default pluginCollapsible;
