# Design System Specification: The Tactile Pixel

This document defines the visual language and structural logic for a high-end, Perler bead-inspired digital experience. We are moving away from the generic "craft site" aesthetic toward a sophisticated, editorial-grid approach that treats every UI element as a physical, touchable bead.

---

## 1. Overview & Creative North Star: "The Digital Curator"
The Creative North Star for this system is **The Digital Curator**. We treat Perler beads not as toys, but as "physical pixels" in a vibrant, artistic mosaic. 

To break the "template" look, this design system rejects rigid, boxed-in grids. Instead, we utilize **intentional asymmetry** and **layered depth**. Imagine a clean, white studio floor where colorful beads have been meticulously arranged—some in perfect rows, others overlapping to create a sense of organized play. We use high-contrast typography scales and breathing room to ensure the "playful" nature feels premium, not juvenile.

---

## 2. Colors: The Pigment Palette
Our palette is derived from the raw plastic pigments of Perler beads. We use high-saturation primaries against an ultra-clean, architectural neutral base.

### Color Strategy
- **Primary (`#b60d3d`):** Our "Cherry Red." Used for high-impact actions and brand moments.
- **Secondary (`#006479`):** Our "Sky Blue." Provides a calming, professional counter-balance to the vibrant primary.
- **Tertiary (`#6d5a00`):** Our "Canary Yellow." Used for highlights and "Golden Moments" in the user journey.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** To maintain a premium feel, boundaries must be defined solely through background color shifts. Use `surface-container-low` sections sitting on a `surface` background to create a clean break.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
- **Base Layer:** `surface` (`#f5f6f7`)
- **Secondary Section:** `surface-container-low` (`#eff1f2`)
- **Interactive Cards:** `surface-container-lowest` (`#ffffff`) 

### The "Glass & Gradient" Rule
To avoid a flat, "out-of-the-box" look, use **Glassmorphism** for floating elements (e.g., navigation bars or modals). Apply `surface-container-lowest` at 80% opacity with a `backdrop-blur: 12px`. For hero sections, use a subtle radial gradient transitioning from `primary` to `primary-container` to add "soul" and dimension.

---

## 3. Typography: Rounded Precision
We pair two distinct typefaces to balance the "playful" bead aesthetic with "editorial" authority.

- **Display & Headlines (Plus Jakarta Sans):** A modern, friendly sans-serif with a high x-height. 
    - *Usage:* Large-scale `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to create a bold, "bead-like" impact.
- **Body & UI (Be Vietnam Pro):** Chosen for its exceptional readability and geometric clarity.
    - *Usage:* `body-lg` (1rem) for descriptions; `label-md` (0.75rem) in All Caps for utility text to add a touch of "designed" sophistication.

The hierarchy is intentionally steep. A massive `display-sm` headline next to a clean `body-md` paragraph creates the "Editorial" tension required for a high-end feel.

---

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines to separate content. We use **Tonal Layering**.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. The subtle shift from `#eff1f2` to `#ffffff` creates a soft, natural lift that mimics light hitting a physical surface.
- **Ambient Shadows:** When a "floating" effect is needed (e.g., a dragged bead or a primary CTA), use an extra-diffused shadow: `box-shadow: 0 12px 32px rgba(44, 47, 48, 0.06);`. The shadow color is a tint of our `on-surface` (`#2c2f30`), never pure black.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. 100% opaque borders are strictly forbidden.
- **Tactile Depth:** Use `9999px` (Full Rounding) for small decorative elements to mimic the circular nature of a single bead, while using the `md` (0.75rem) scale for larger containers.

---

## 5. Components: The Building Blocks

### Buttons: The Tactile Toggle
Buttons must feel like something you want to press.
- **Primary:** `primary` background with `on-primary` text. Use `border-radius: full` to mimic a bead.
- **Secondary:** `secondary-container` background. 
- **States:** On hover, shift background to `primary-dim`. On press, use a subtle `scale(0.96)` transform to provide haptic-like visual feedback.

### Cards: Content Vessels
- **Rule:** No dividers. Use `surface-container-lowest` for the card body. 
- **Spacing:** Use `spacing-6` (1.5rem) for internal padding to give content room to breathe.
- **Interaction:** On hover, lift the card by shifting from `surface-container-lowest` to a subtle ambient shadow.

### Input Fields: Clean Enclosures
- Use `surface-container-high` (`#e0e3e4`) for the input track. 
- Rounding: `DEFAULT` (0.5rem). 
- Active state: Use a 2px "Ghost Border" of `primary` at 40% opacity.

### The "Pattern Grid" (Custom Component)
For the bead-work area, use a repeating background pattern of subtle circles (`surface-variant` at 20% opacity) to evoke the Perler pegboard without cluttering the UI.

---

## 6. Do's and Don'ts

### Do:
- **Do** use overlapping elements (e.g., an image overlapping a background color block) to create depth.
- **Do** use the `tertiary` (Yellow) palette for "Success" or "Celebration" moments instead of standard green.
- **Do** rely on the Spacing Scale (specifically `spacing-12` and `spacing-16`) to create massive "Editorial" margins.

### Don't:
- **Don't** use 1px solid black or grey borders. They break the "tactile" illusion.
- **Don't** use standard "drop shadows" with high opacity. They make the design look dated and heavy.
- **Don't** crowd the layout. If a section feels "busy," increase the background `surface` contrast instead of adding lines.
- **Don't** use sharp corners. Everything in this system should feel safe, rounded, and approachable.

---