import { test, expect } from '../fixtures/base'
import AxeBuilder from '@axe-core/playwright'
import { PASSWORD } from '../data/users'
import { PRODUCTS } from '../data/products'

const [BACKPACK] = PRODUCTS

test.describe('Accessibility', () => {
  test('login page has no critical or serious violations', async ({ loginPage }) => {
    await loginPage.goto()

    const results = await new AxeBuilder({ page: loginPage.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const violations = results.violations.filter((v) =>
      ['critical', 'serious'].includes(v.impact ?? '')
    )

    expect(violations.length).toBe(0)
  })

  test('inventory page has 1 known violation (sort select lacks label)', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()

    const results = await new AxeBuilder({ page: inventoryPage.page })
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

  test('checkout step 1 has no critical or serious violations', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
    await loginPage.goto()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()
    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.goToCart()
    await cartPage.isLoaded()
    await cartPage.goToCheckout()

    const results = await new AxeBuilder({ page: checkoutPage.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const violations = results.violations.filter((v) =>
      ['critical', 'serious'].includes(v.impact ?? '')
    )

    expect(violations.length).toBe(0)
  })
})
