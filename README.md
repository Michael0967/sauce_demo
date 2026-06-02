# SauceDemo E2E Testing

[![Playwright Tests](https://github.com/Michael0967/sauce_demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/Michael0967/sauce_demo/actions/workflows/playwright.yml)

End-to-end test suite for [SauceDemo](https://www.saucedemo.com/) built with **Playwright** and **TypeScript** — a portfolio project demonstrating professional QA patterns.

## Stack

| Tool | Purpose |
|---|---|
| **Playwright** | Cross-browser test automation (Chromium, Firefox, WebKit) |
| **TypeScript** | Static typing for maintainable code |
| **Page Object Model** | Clean abstraction of UI pages with JSDoc |
| **axe-core** | Accessibility audit (WCAG 2.0 / 2.1) |
| **GitHub Actions** | CI pipeline with HTML report artifact |

## Project Structure

```
tests/
├── data/              Typed fixtures
│   ├── users.ts
│   └── products.ts
├── fixtures/          Custom Playwright fixtures (test.extend)
│   └── base.ts
├── pages/             Page Object Models with JSDoc
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
└── specs/             9 test specifications
    ├── login.spec.ts
    ├── login-ui.spec.ts
    ├── inventory.spec.ts
    ├── cart.spec.ts
    ├── checkout.spec.ts
    ├── performance.spec.ts
    ├── visual.spec.ts
    ├── accessibility.spec.ts
    └── problem-user.spec.ts
```

## Coverage — 129 tests (43 scenarios × 3 browsers)

| Module | Tests | What it validates |
|---|---|---|
| **Login** | 11 | 5 valid users, locked out, wrong password, empty fields, error dismissal |
| **Login UI** | 2 | Password masking, session clear on logout |
| **Inventory** | 7 | 6 items displayed, sort by price (Low→High, High→Low), sort by name (A→Z, Z→A), button toggles to Remove |
| **Cart** | 6 | Badge count (1 / 3), remove clears badge, cart page persistence, Continue Shopping flow |
| **Checkout** | 6 | Empty field validation (first name / last name / postal code), cancel, successful order, subtotal + tax = total |
| **Performance** | 2 | Standard user < 5s, glitch user is slower than standard (~110ms vs ~5000ms) |
| **Visual** | 3 | Screenshot regression: login, login with error, inventory |
| **Accessibility** | 3 | Login page (0 violations), inventory (1 known: `select-name`), checkout step 1 (0 violations) |
| **Bug Discovery** | 3 | `problem_user` with `test.fail()`: broken images (`sl-404.jpg`), all images identical, sort doesn't reorder |

## Bug Discovery

### `problem_user` — 3 known defects (expected failures)

These tests use Playwright's `test.fail()` — they **pass when the assertion fails** (confirming the bug still exists) and **fail if the bug is ever fixed** (alerting the team).

| Test | Status | Evidence |
|---|---|---|
| Image mismatch | ✅ Expected failure | All products show `sl-404.jpg` instead of their expected image |
| Non-unique images | ✅ Expected failure | All 6 product images are identical (Set.size = 1) |
| Sort Low→High | ✅ Expected failure | Prices stay in default order instead of sorting |

### SauceDemo app — 1 accessibility defect

| Rule | Impact | Element |
|---|---|---|
| `select-name` | critical | Sort dropdown `.product_sort_container` lacks an accessible label |

## Performance Insights

| User | Login → Inventory | Observation |
|---|---|---|
| `standard_user` | ~110ms | Baseline |
| `performance_glitch_user` | ~5000ms | **45x slower** — reproducible delay |

All performance metrics are logged to stdout during test execution with `[PERF]` prefix.

## Getting Started

```bash
npm install
npx playwright install
```

## Scripts

| Command | Description |
|---|---|
| `npm test` | Run all tests headless (Chromium, Firefox, WebKit) |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui` | Interactive Playwright UI mode |
| `npm run report` | Open HTML report |

## Visual Snapshots

Snapshots are stored in `tests/specs/*-snapshots/` and versioned in git. The `snapshotPathTemplate` omits the platform suffix (`{platform}`), so the same snapshots work across macOS and Linux CI. Regenerate them when the UI changes:

```bash
npx playwright test --update-snapshots -g "Visual Regression"
```

## CI Pipeline

Every push to `main` triggers a GitHub Actions workflow that:

1. Installs dependencies (`npm ci`)
2. Installs Playwright browsers with system deps
3. Runs all 129 tests (43 scenarios × Chromium, Firefox, WebKit)
4. Uploads the HTML report as an artifact (30-day retention)

## Key Patterns

- **Page Object Model** with JSDoc — each POM documents its input/output contract
- **Zero raw locators in tests** — all interactions go through POM methods
- **Custom Playwright fixtures** — `test.extend()` provides typed POM instances directly to test parameters
- **`data-test` selectors** — resilient against UI changes
- **Data-driven testing** — typed fixtures eliminate duplicated test code
- **Bug-first discovery** — `test.fail()` marks known defects as expected failures; tests pass when bugs are confirmed and alert when fixed
- **Financial validation** — `subtotal + tax = total` assertion with `toBeCloseTo`
- **Performance profiling** — `[PERF]` console output, user comparison
- **Visual regression** — `toHaveScreenshot` with `maxDiffPixelRatio: 0.02`
- **Accessibility audit** — axe-core integrated, categorized by impact (critical / serious)
- **Cross-browser** — runs on Chromium, Firefox, and WebKit
