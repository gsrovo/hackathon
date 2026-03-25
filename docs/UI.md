# UI / Design System

## Brand Identity

**Brand name:** Maison
**Concept:** Luxury fashion e-commerce — editorial, refined, restrained.
**Tone:** Sophisticated, minimal, aspirational. No rounded corners everywhere, no bright colors, no gradients.

---

## Typography

| Role      | Font               | Variable                            | Usage                            |
| --------- | ------------------ | ----------------------------------- | -------------------------------- |
| Headings  | Cormorant Garamond | `--font-cormorant` / `font-heading` | h1–h4, brand name, hero copy     |
| Body / UI | Geist Sans         | `--font-geist-sans` / `font-sans`   | paragraphs, labels, buttons, nav |
| Mono      | Geist Mono         | `--font-geist-mono` / `font-mono`   | code, IDs, order numbers         |

**Rules:**

- Headings use `font-heading` class (`font-family: var(--font-cormorant)`)
- Keep heading `font-weight` light: `font-light` (300) or `font-normal` (400)
- Use `tracking-wide` or `tracking-[0.3em]` on brand name and uppercase labels
- Never use bold (`font-bold`) on headings — it breaks the luxury feel
- Body text stays in Geist Sans at default weight

```tsx
// ✅ Correct
<h1 className="font-heading text-4xl font-light tracking-wide">New Arrivals</h1>
<p className="text-muted-foreground text-sm tracking-wide">Members only</p>

// ❌ Wrong
<h1 className="text-4xl font-bold">New Arrivals</h1>
```

---

## Color Palette

All colors are defined as CSS variables in `src/app/globals.css` using the **OKLCh** color space.

### Light Mode (default)

| Token                  | Value                   | Role                                    |
| ---------------------- | ----------------------- | --------------------------------------- |
| `--background`         | `oklch(0.982 0.006 82)` | Warm ivory page background              |
| `--foreground`         | `oklch(0.145 0.012 55)` | Deep warm charcoal text                 |
| `--card`               | `oklch(1 0.003 82)`     | Near-white with warmth                  |
| `--primary`            | `oklch(0.18 0.014 55)`  | Deep charcoal — CTAs, buttons           |
| `--primary-foreground` | `oklch(0.982 0.006 82)` | Ivory on charcoal                       |
| `--accent`             | `oklch(0.78 0.1 82)`    | **Champagne gold** — highlights, badges |
| `--accent-foreground`  | `oklch(0.145 0.012 55)` | Charcoal on gold                        |
| `--muted`              | `oklch(0.948 0.01 78)`  | Warm light grey surface                 |
| `--muted-foreground`   | `oklch(0.52 0.014 58)`  | Secondary text                          |
| `--border`             | `oklch(0.90 0.01 78)`   | Subtle warm border                      |
| `--ring`               | `oklch(0.78 0.1 82)`    | Gold focus ring                         |
| `--gold`               | `oklch(0.78 0.1 82)`    | Brand gold (direct use)                 |

### Dark Mode

| Token                  | Value                  | Role                             |
| ---------------------- | ---------------------- | -------------------------------- |
| `--background`         | `oklch(0.13 0.014 55)` | Deep warm charcoal               |
| `--foreground`         | `oklch(0.97 0.006 82)` | Warm ivory text                  |
| `--primary`            | `oklch(0.80 0.1 82)`   | **Gold becomes the primary CTA** |
| `--primary-foreground` | `oklch(0.13 0.014 55)` | Charcoal on gold                 |
| `--accent`             | `oklch(0.80 0.1 82)`   | Gold                             |

### Sidebar

The sidebar is always **dark charcoal** regardless of light/dark mode — this gives it a persistent "navigation rail" identity.

| Token               | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| `--sidebar`         | `oklch(0.15 0.014 55)` (light) / `oklch(0.10 0.012 55)` (dark) |
| `--sidebar-primary` | Gold `oklch(0.78 0.1 82)` — active item                        |
| `--sidebar-accent`  | Slightly lighter charcoal — hover state                        |
| `--sidebar-ring`    | Gold                                                           |

---

## Spacing & Shape

| Property      | Value                 | Rationale                            |
| ------------- | --------------------- | ------------------------------------ |
| `--radius`    | `0.25rem`             | Sharp, editorial. No bubbly corners. |
| `--radius-sm` | `calc(0.25rem * 0.6)` | ~1.5px                               |
| `--radius-lg` | `0.25rem`             | Same as base                         |

**Rules:**

- Prefer `rounded` (uses `--radius`) over explicit `rounded-lg`, `rounded-xl`
- Never use `rounded-full` on rectangular elements (pills are ok for tags/badges only)
- Cards have a very subtle border — `border border-border` — never box-shadow as the primary elevation

---

## Component Patterns

### Buttons

```tsx
// Primary — charcoal (light) / gold (dark)
<Button>Place Order</Button>

// Outline — for secondary actions and social login
<Button variant="outline">Continue with Google</Button>

// Ghost — for nav/icon actions
<Button variant="ghost" size="icon"><Icon /></Button>
```

- Never use `variant="link"` for actions — use `<Link>` with `underline underline-offset-4` instead
- CTA buttons are full-width in forms: `className="w-full"`

### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle className="font-heading text-2xl font-light">
      Order #1042
    </CardTitle>
    <CardDescription className="tracking-wide">
      Placed on Jan 15, 2025
    </CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

- `CardTitle` always uses `font-heading font-light`
- `CardDescription` uses `tracking-wide` for refinement
- No drop shadows on cards — use `border-border` border only

### Forms

```tsx
<div className="flex flex-col gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
  {error && <p className="text-destructive text-sm">{error}</p>}
</div>
```

- Field spacing: `gap-4` between fields, `gap-1.5` between label+input
- Error messages: `text-destructive text-sm` — no icons
- Never use native `<input>` — always `<Input>` from `@/components/ui/input`
- Never use native `<button>` — always `<Button>` from `@/components/ui/button`

### Separators with label

```tsx
<div className="flex items-center gap-3">
  <Separator className="flex-1" />
  <span className="text-muted-foreground text-xs">or</span>
  <Separator className="flex-1" />
</div>
```

### Status Badges

Use the `badge` variant pattern with warm tones — avoid pure green/red:

```tsx
// pending
<Badge variant="outline">Pending</Badge>

// active / delivered — accent gold
<Badge className="bg-accent text-accent-foreground">Active</Badge>

// cancelled / error — destructive
<Badge variant="destructive">Cancelled</Badge>
```

---

## Page Layout Patterns

### Auth pages — Split screen

```
┌─────────────────────────┬─────────────────────────┐
│   bg-primary            │   bg-background          │
│   (dark charcoal)       │   (ivory)                │
│                         │                          │
│   Brand name            │   Form card              │
│   Editorial quote       │                          │
│   Footer copyright      │                          │
└─────────────────────────┴─────────────────────────┘
```

- Left panel: hidden on mobile (`hidden lg:flex`), `w-1/2`, `bg-primary text-primary-foreground`
- Right panel: `w-full lg:w-1/2`, centered content, `max-w-sm`
- Mobile: show brand name above the form card

### Dashboard pages

```
┌──────────┬──────────────────────────────────────────┐
│ Sidebar  │  Page header                             │
│ (dark)   │  ─────────────────────────────────────   │
│          │  Content area                            │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

- Sidebar: `bg-sidebar text-sidebar-foreground` — always dark
- Page header: brand name / page title in `font-heading font-light`
- Content: `p-6 lg:p-10` padding, `max-w-5xl` for reading-width content

---

## Do's and Don'ts

| ✅ Do                                          | ❌ Don't                                 |
| ---------------------------------------------- | ---------------------------------------- |
| Use `font-heading` on all titles               | Use `font-bold` on headings              |
| Use gold (`accent`) for highlights and focus   | Use bright/saturated colors              |
| Keep generous whitespace                       | Crowd elements together                  |
| Use `tracking-wide` on labels and small caps   | Use default tight tracking on UI labels  |
| Use `border-border` for card outlines          | Use box-shadow for elevation             |
| Use `text-muted-foreground` for secondary text | Use grey hardcoded values                |
| Use shadcn primitives from `@/components/ui/`  | Use native HTML form elements            |
| Use `font-light` for large display text        | Use `font-bold` or `font-extrabold`      |
| Keep radius sharp (`rounded` = 0.25rem)        | Use `rounded-xl`, `rounded-2xl` on cards |
