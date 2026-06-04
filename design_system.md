# Academic Excellence Portal Design System

## Theme Settings (JSON Representation)
```json
{
  "colorMode": "LIGHT",
  "font": "NEWSREADER",
  "roundness": "ROUND_FOUR",
  "customColor": "#6B1B1B",
  "headlineFont": "NEWSREADER",
  "bodyFont": "INTER",
  "labelFont": "INTER",
  "namedColors": {
    "background": "#fff8f7",
    "error": "#ba1a1a",
    "error_container": "#ffdad6",
    "inverse_on_surface": "#ffedeb",
    "inverse_primary": "#ffb3ae",
    "inverse_surface": "#392e2d",
    "on_background": "#231919",
    "on_error": "#ffffff",
    "on_error_container": "#93000a",
    "on_primary": "#ffffff",
    "on_primary_container": "#f1817b",
    "on_primary_fixed": "#410004",
    "on_primary_fixed_variant": "#7e2928",
    "on_secondary": "#ffffff",
    "on_secondary_container": "#6e4900",
    "on_secondary_fixed": "#291800",
    "on_secondary_fixed_variant": "#614000",
    "on_surface": "#231919",
    "on_surface_variant": "#554241",
    "on_tertiary": "#ffffff",
    "on_tertiary_container": "#78a9b7",
    "on_tertiary_fixed": "#001f26",
    "on_tertiary_fixed_variant": "#184d59",
    "outline": "#897270",
    "outline_variant": "#dcc0be",
    "primary": "#4d0408",
    "primary_container": "#6b1b1b",
    "primary_fixed": "#ffdad7",
    "primary_fixed_dim": "#ffb3ae",
    "secondary": "#805600",
    "secondary_container": "#fdb742",
    "secondary_fixed": "#ffddb0",
    "secondary_fixed_dim": "#ffba47",
    "surface": "#fff8f7",
    "surface_bright": "#fff8f7",
    "surface_container": "#fdeae8",
    "surface_container_high": "#f7e4e2",
    "surface_container_highest": "#f1dedd",
    "surface_container_low": "#fff0ef",
    "surface_container_lowest": "#ffffff",
    "surface_dim": "#e8d6d4",
    "surface_tint": "#9d403d",
    "surface_variant": "#f1dedd",
    "tertiary": "#00272f",
    "tertiary_container": "#003e4a",
    "tertiary_fixed": "#b9ebfa",
    "tertiary_fixed_dim": "#9dcedd"
  }
}
```

## Design System Guidelines (Markdown)

```markdown
---
name: Academic Excellence Portal
colors:
  surface: '#fff8f7'
  surface-dim: '#e8d6d4'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ef'
  surface-container: '#fdeae8'
  surface-container-high: '#f7e4e2'
  surface-container-highest: '#f1dedd'
  on-surface: '#231919'
  on-surface-variant: '#554241'
  inverse-surface: '#392e2d'
  inverse-on-surface: '#ffedeb'
  outline: '#897270'
  outline-variant: '#dcc0be'
  surface-tint: '#9d403d'
  primary: '#4d0408'
  on-primary: '#ffffff'
  primary-container: '#6b1b1b'
  on-primary-container: '#f1817b'
  inverse-primary: '#ffb3ae'
  secondary: '#805600'
  on-secondary: '#ffffff'
  secondary-container: '#fdb742'
  on-secondary-container: '#6e4900'
  tertiary: '#00272f'
  on-tertiary: '#ffffff'
  tertiary-container: '#003e4a'
  on-tertiary-container: '#78a9b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ae'
  on-primary-fixed: '#410004'
  on-primary-fixed-variant: '#7e2928'
  secondary-fixed: '#ffddb0'
  secondary-fixed-dim: '#ffba47'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#614000'
  tertiary-fixed: '#b9ebfa'
  tertiary-fixed-dim: '#9dcedd'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#184d59'
  background: '#fff8f7'
  on-background: '#231919'
  surface-variant: '#f1dedd'
typography:
  h1:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  h2:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is anchored in the values of a prestigious Malaysian public university: heritage, discipline, and progress. It balances a traditional academic aesthetic with a highly functional, modern digital experience. The target audience includes students seeking career pathways and administrative staff managing high volumes of data; thus, the UI prioritizes clarity and efficiency over decorative flair.

The chosen style is **Corporate / Modern** with a strong leaning toward **Minimalism**. It avoids the transience of trends like glassmorphism or neomorphism in favor of a stable, institutional interface. The presence of serif typography provides an authoritative, scholarly tone, while the clean, grid-based layout ensures the platform feels like a reliable tool for professional advancement.

## Colors

The palette is rooted in institutional tradition. The **Primary Deep Maroon** conveys authority and the university's heritage, used primarily for headers, primary actions, and "Accepted" states. The **Warm Amber/Gold** acts as a refined accent, guiding the eye to critical information and marking "Reviewed" states. 

The background uses an **Off-White** to reduce eye strain and provide a softer, more premium feel than pure white. Neutral greys are reserved for "Pending" statuses and secondary information. This system ensures high contrast for accessibility while maintaining a sophisticated, scholarly atmosphere.

## Typography

The typographic strategy utilizes a dual-font approach to distinguish between content hierarchy and functional utility. **Newsreader** (Serif) is used for all headlines to evoke a sense of academic tradition and intellectual authority. It should be used with generous leading to maintain its literary character.

**Inter** (Sans-serif) is the workhorse font for all body text, navigation elements, and data entries. It was selected for its exceptional legibility on digital screens, even at small sizes. All labels and functional text should utilize Inter to ensure the portal feels modern and systematic.

## Layout & Spacing

The design system employs a **Fixed Grid** philosophy for desktop views to maintain a structured, organized appearance consistent with institutional documents. A 12-column grid is used with a maximum container width of 1280px.

A strict 8px spacing scale governs all padding and margins. This mathematical rhythm ensures that elements feel intentionally placed. Vertical rhythm is prioritized in listing pages to ensure that large volumes of internship postings remain digestible and scannable.

## Elevation & Depth

The design system uses **Low-Contrast Outlines** and subtle tonal shifts rather than heavy shadows to indicate depth. Surfaces should feel flat and integrated into the layout, reflecting a "no-nonsense" functional environment.

Cards and containers use a 1px solid border (#E5E1DA) rather than drop shadows. When an element requires focus, a slight increase in border weight or a subtle background tint is preferred over elevation. This maintains the clean, professional aesthetic requested, ensuring the portal feels grounded and stable.

## Shapes

The shape language is conservative and structural. The system uses a **Soft (Level 1)** roundedness (4px) for most components, such as buttons, input fields, and cards. This slight rounding prevents the UI from feeling overly aggressive or "sharp" while maintaining a precise, disciplined appearance.

Status labels and tags may use a slightly higher radius (8px) to differentiate them from interactive elements like buttons, but the system strictly avoids pill-shaped or excessively rounded elements to preserve its professional character.

## Components

### Buttons
Primary buttons are solid Maroon (#6B1B1B) with White text. Secondary buttons use a Maroon outline with Maroon text. There are no gradients; hover states are indicated by a 10% darkening of the fill.

### Cards & Listings
The signature component of this design system is the internship listing card. These are pure white (#FFFFFF) with a 1px neutral border. Each card features a 4px solid left border in **Warm Amber (#C4860A)** to provide a vertical accent and visual rhythm to lists.

### Status Labels
Status labels are small, uppercase tags with a light background tint and bold text:
- **Pending:** Grey (#6B7280) background at 10% opacity, solid Grey text.
- **Reviewed:** Amber (#C4860A) background at 10% opacity, solid Amber text.
- **Accepted:** Maroon (#6B1B1B) background at 10% opacity, solid Maroon text.

### Input Fields
Fields are rectangular with a 1px border. Focus states are indicated by a 1px Maroon ring. Labels sit above the field in Inter (Label-md) to maximize vertical scanning.

### Navigation
The top navigation bar is clean, utilizing the Primary Maroon for the active state and the university logo, set against the Off-White background to maintain a lightweight feel.
```
