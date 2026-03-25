/**
 * Generates a unique ID for ARIA relationships.
 */
export function genId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Returns props to announce a live region message to screen readers.
 */
export function liveRegionProps(politeness: "polite" | "assertive" = "polite") {
  return {
    role: politeness === "assertive" ? ("alert" as const) : ("status" as const),
    "aria-live": politeness,
    "aria-atomic": true,
  } as const;
}

/**
 * Checks if an element is focusable.
 */
export function isFocusable(el: Element): el is HTMLElement {
  const focusableSelectors =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return el.matches(focusableSelectors);
}

/**
 * Returns all focusable elements within a container.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}
