import { test, expect } from '../fixtures/base'
import { PASSWORD } from '../data/users'
import { PRODUCTS } from '../data/products'

test.describe('Problem User — Bug Discovery', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto()
    await loginPage.login('problem_user', PASSWORD)
    await inventoryPage.isLoaded()
  })

  test.fail('KNOWN DEFECT: product images do not match their product names', async ({ inventoryPage }) => {
    const imageSources = await inventoryPage.getImageSources()
    const productNames = await inventoryPage.getProductNames()

    for (let i = 0; i < PRODUCTS.length; i++) {
      const product = PRODUCTS[i]
      const src = imageSources[i]

      expect(productNames[i]).toBe(product.name)

      const hasExpectedImage = src.includes(product.expectedImage)
      if (!hasExpectedImage) {
        console.log(
          `[BUG] "${product.name}": expected image containing "${product.expectedImage}", got "${src.split('/').pop()}"`
        )
      }
      expect(hasExpectedImage).toBeTruthy()
    }
  })

  test.fail('KNOWN DEFECT: product images are not unique (all show same image)', async ({ inventoryPage }) => {
    const imageSources = await inventoryPage.getImageSources()
    const uniqueSources = new Set(imageSources)

    expect(uniqueSources.size).toBeGreaterThan(1)
  })

  test.fail('sort by price Low → High does not reorder items correctly', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi')

    const prices = await inventoryPage.getPrices()
    const sorted = [...prices].sort((a, b) => a - b)

    const isSorted = prices.every((p, i) => p === sorted[i])
    if (!isSorted) {
      console.log('[BUG] Sort Low→High failed. Got:', prices, 'Expected:', sorted)
    }
    expect(isSorted).toBeTruthy()
  })
})
