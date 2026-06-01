import { test, expect } from '../fixtures/base'
import { PASSWORD } from '../data/users'
import { SORT_OPTIONS, PRODUCTS } from '../data/products'

const [BACKPACK] = PRODUCTS

test.describe('Inventory', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()
  })

  test('product list displays 6 items', async ({ inventoryPage }) => {
    const count = await inventoryPage.getItemCount()
    expect(count).toBe(6)
  })

  test('all product names match expected products', async ({ inventoryPage }) => {
    const names = await inventoryPage.getProductNames()
    const expected = PRODUCTS.map((p) => p.name)
    expect(names).toEqual(expected)
  })

  test.describe('sort by price', () => {
    test('Low → High orders prices ascending', async ({ inventoryPage }) => {
      await inventoryPage.sortBy(SORT_OPTIONS.PRICE_LOW_HIGH)
      const prices = await inventoryPage.getPrices()

      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1])
      }
    })

    test('High → Low orders prices descending', async ({ inventoryPage }) => {
      await inventoryPage.sortBy(SORT_OPTIONS.PRICE_HIGH_LOW)
      const prices = await inventoryPage.getPrices()

      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i - 1])
      }
    })
  })

  test.describe('sort by name', () => {
    test('A → Z orders names alphabetically', async ({ inventoryPage }) => {
      await inventoryPage.sortBy(SORT_OPTIONS.NAME_AZ)
      const names = await inventoryPage.getProductNames()
      const sorted = [...names].sort()

      expect(names).toEqual(sorted)
    })

    test('Z → A orders names descending', async ({ inventoryPage }) => {
      await inventoryPage.sortBy(SORT_OPTIONS.NAME_ZA)
      const names = await inventoryPage.getProductNames()
      const sorted = [...names].sort().reverse()

      expect(names).toEqual(sorted)
    })
  })

  test('add to cart button toggles to Remove', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(BACKPACK)
    const button = inventoryPage.page.locator(
      `[data-test="remove-${BACKPACK.id}"]`
    )
    await expect(button).toBeVisible()
  })
})
