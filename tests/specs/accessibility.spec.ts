import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { PASSWORD } from '../data/users'
import { PRODUCTS } from '../data/products'

const [BACKPACK] = PRODUCTS

test.describe('Accessibility', () => {
  test('login page has no critical or serious violations', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const violations = results.violations.filter((v) =>
      ['critical', 'serious'].includes(v.impact ?? '')
    )

    expect(violations.length).toBe(0)
  })

  test('inventory page has 1 known violation (sort select lacks label)', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await loginPage.goto()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const violations = results.violations.filter((v) =>
      ['critical', 'serious'].includes(v.impact ?? '')
    )

    for (const v of violations) {
      console.log(`[A11Y] ${v.id}: ${v.help} (${v.impact}) — ${v.nodes.length} nodes`)
    }

    expect(violations.length).toBe(1)
    expect(violations[0].id).toBe('select-name')
  })

  test('checkout step 1 has no critical or serious violations', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutPage = new CheckoutPage(page)

    await loginPage.goto()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()
    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.goToCart()
    await cartPage.isLoaded()
    await cartPage.goToCheckout()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const violations = results.violations.filter((v) =>
      ['critical', 'serious'].includes(v.impact ?? '')
    )

    expect(violations.length).toBe(0)
  })
})
