# SauceDemo E2E Testing

End-to-end test suite for [SauceDemo](https://www.saucedemo.com/) built with **Playwright** and **TypeScript**, designed as a portfolio project demonstrating modern testing patterns.

## Stack

| Tool | Purpose |
|---|---|
| **Playwright** | Cross-browser test automation |
| **TypeScript** | Static typing for maintainable code |
| **Page Object Model** | Clean abstraction of UI pages |

## Project Structure

```
tests/
├── data/
│   ├── users.ts
│   └── products.ts
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
└── specs/
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

## Coverage — 43 tests

| Module | Tests | What it validates |
|---|---|---|
| **Login** | 11 | 5 valid users, locked out, wrong password, empty fields, error dismissal |
| **Login UI** | 2 | Password masking, session clear on logout (vía POM) |
| **Inventory** | 7 | 6 items, sort Low→High (valida precios), sort High→Low, sort A→Z, sort Z→A, botón toggles Remove |
| **Cart** | 6 | Badge count (1 / 3), remove clears badge, cart page persistencia, Continue Shopping |
| **Checkout** | 6 | Validación campos vacíos (3), cancel, checkout exitoso, subtotal + tax = total |
| **Performance** | 2 | standard_user \< 5s, glitch_user es más lento que standard (107ms vs 5s) |
| **Visual** | 3 | Screenshot regression: login, login con error, inventory |
| **Accessibility** | 3 | axe-core: login 0 violaciones, inventory (1 conocida: `select-name`), checkout 0 |
| **Bug Discovery** | 3 | `problem_user`: imágenes rotas (`sl-404.jpg`), todas iguales, sort defectuoso |

## Bug Discovery

### `problem_user` — 3 defects found

| Test | Result | Evidence |
|---|---|---|
| Image mismatch | ❌ FAIL | All products show `sl-404.jpg` instead of their expected image |
| Non-unique images | ❌ FAIL | All 6 product images are identical (Set.size = 1) |
| Sort Low→High | ❌ FAIL | Prices stay in default order instead of sorting |

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
| `npm test` | Run all tests headless |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui` | Interactive Playwright UI mode |
| `npm run report` | Open HTML report |

## Key Patterns

- **Page Object Model** con JSDoc — cada POM documenta su entrada/salida
- **Zero raw locators en tests** — toda interacción pasa por métodos del POM
- **data-test selectors** — resilientes contra cambios de UI
- **Data-driven testing** — fixtures tipados eliminan código duplicado
- **Bug-first discovery** — tests que fallan intencionalmente documentando defects reales
- **Validación financiera** — assertion `subtotal + tax = total` con `toBeCloseTo`
- **Performance profiling** — métricas con `[PERF]` en consola, comparación de usuarios
- **Visual regression** — `toHaveScreenshot` con `maxDiffPixelRatio: 0.02`
- **Accessibility audit** — axe-core integrado, categorizado por impacto (critical / serious)