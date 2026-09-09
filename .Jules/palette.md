## 2026-03-09 - Accessible Custom Controls for Sliders & Icons
**Learning:** Custom slider indicators built using non-interactive HTML elements (`<span>`) prevent keyboard navigation and screen reader awareness. Replacing them with semantic `<button>` elements with `aria-label` and `aria-current` attributes significantly improves accessibility without changing visual styling.
**Action:** Always prefer native semantic elements (`<button>`) for interactive slider controls and ensure icon-only buttons receive descriptive `aria-label` attributes across all HTML templates.
