---
name: AssetMap
colors:
  surface: '#fbf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fbf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#1e1200'
  on-tertiary: '#ffffff'
  tertiary-container: '#35260c'
  on-tertiary-container: '#a38c6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#fadfb8'
  tertiary-fixed-dim: '#ddc39d'
  on-tertiary-fixed: '#271902'
  on-tertiary-fixed-variant: '#564427'
  background: '#fbf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
  sidebar-width: 280px
  drawer-width: 400px
---

## Brand & Style
The design system is engineered for utility, precision, and clarity. It serves a technical audience that requires immediate access to asset status, location data, and maintenance schedules. The brand personality is **reliable, professional, and methodical**.

The aesthetic follows a **Modern Corporate** approach with a focus on high information density without visual clutter. It prioritizes functional hierarchy over decorative elements, using a structured layout to make complex data-heavy environments feel organized and manageable. The emotional response should be one of "systematic control" and "trustworthy data."

## Colors
This design system utilizes a palette rooted in slate and navy tones to provide a stable, neutral foundation for technical work.

- **Primary (Slate Navy):** Used for navigation, primary actions, and key identifiers. It conveys authority and stability.
- **Functional Colors:** Success (Emerald), Warning (Amber), and Danger (Rose) are reserved strictly for status communication—such as asset health, battery levels, or connectivity alerts—to ensure they stand out against the neutral UI.
- **Background & Surface:** The `F8FAFC` background provides a soft contrast against `FFFFFF` surface cards, reducing eye strain during long periods of monitoring.

## Typography
The system uses **Inter** for its exceptional legibility in data interfaces. **JetBrains Mono** is introduced as a secondary font for technical identifiers, serial numbers, and coordinates to prevent character confusion (e.g., distinguishing '0' from 'O').

- **Hierarchy:** Use `headline-md` for view titles and `body-md` for primary data points in tables.
- **Monospace:** Use `code-sm` for asset IDs and GPS coordinates.
- **Accessibility:** Line heights are kept generous to maintain readability in dense information grids.

## Layout & Spacing
The layout uses a **Fluid Grid** approach for the main map/dashboard area, but relies on fixed-width sidebars and drawers for asset details.

- **Sidebar:** A persistent 280px navigation on the left.
- **Drawers:** Contextual drawers for asset details slide in from the right at 400px width.
- **Grid:** A 12-column system is used within surface cards.
- **Responsive:** On mobile, sidebars collapse into a bottom navigation bar, and drawers transition to full-screen overlays to maximize the limited horizontal space.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows.

- **Level 0 (Background):** `F8FAFC` - The canvas.
- **Level 1 (Surface):** `FFFFFF` with a 1px border of `E2E8F0`. Used for data tables and dashboard cards.
- **Level 2 (Overlay/Drawer):** `FFFFFF` with a subtle ambient shadow (4px blur, 5% opacity) to indicate temporary priority.
- **Interactive:** Hover states on table rows use a subtle background shift to `F1F5F9` instead of an elevation change.

## Shapes
A **Rounded** shape language is used to soften the technical nature of the tool without feeling unprofessional. 

- **Base Radius:** 8px (0.5rem) for buttons, input fields, and small cards.
- **Container Radius:** 12px (0.75rem) for main content areas and side drawers.
- **Pill:** Fully rounded (9999px) is used exclusively for status badges and chips.

## Components

- **Data Tables:** Use `body-sm` for rows. Row height is fixed at 48px to ensure density. Headers should be `label-md` with a subtle gray background.
- **Status Badges:** Use a "soft" style—tinted background (10% opacity of the functional color) with high-contrast text. For example, a "Critical" badge uses a light rose background with deep rose text.
- **Input Fields:** 1px border (`E2E8F0`) with 8px corner radius. On focus, the border transitions to Primary Navy with a 2px outer glow.
- **Buttons:**
    - *Primary:* Solid Slate Navy with white text.
    - *Secondary:* White background with Slate Navy border.
    - *Icon-only:* For map controls, use square buttons with 8px radius.
- **Map Legend:** A floating surface component (Level 2 elevation) positioned in the bottom-right of the map view, using `body-sm` for labels.
- **Side Drawers:** Include a header with a clear "Close" icon and a persistent "Action Footer" for saving changes to asset properties.