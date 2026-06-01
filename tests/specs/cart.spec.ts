import { test, expect } from '../fixtures/base'
import { PASSWORD } from '../data/users'
import { PRODUCTS } from '../data/products'

const [BACKPACK, BIKE_LIGHT, BOLT_SHIRT] = PRODUCTS

test.describe('Cart', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()
  })

  test('add single product shows badge count of 1', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(BACKPACK)
    const badge = await inventoryPage.getCartBadgeCount()
    expect(badge).toBe(1)
  })

  test('add multiple products shows correct badge count', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.addToCart(BIKE_LIGHT)
    await inventoryPage.addToCart(BOLT_SHIRT)

    const badge = await inventoryPage.getCartBadgeCount()
    expect(badge).toBe(3)
  })

  test('remove product clears badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(BACKPACK)
    const badgeAfterAdd = await inventoryPage.getCartBadgeCount()
    expect(badgeAfterAdd).toBe(1)

    await inventoryPage.removeFromCart(BACKPACK)
    const badgeAfterRemove = await inventoryPage.getCartBadgeCount()
    expect(badgeAfterRemove).toBe(0)
  })

  test('cart page reflects added products', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.addToCart(BIKE_LIGHT)
    await inventoryPage.goToCart()
    await cartPage.isLoaded()

    const count = await cartPage.getItemCount()
    expect(count).toBe(2)
  })

  test('remove from cart page updates count', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.addToCart(BIKE_LIGHT)
    await inventoryPage.goToCart()
    await cartPage.isLoaded()

    await cartPage.removeProduct(BACKPACK)
    const count = await cartPage.getItemCount()
    expect(count).toBe(1)
  })

  test('continue shopping returns to inventory', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.goToCart()
    await cartPage.isLoaded()
    await cartPage.clickContinueShopping()

    await inventoryPage.isLoaded()
    await expect(inventoryPage.page).toHaveURL(/\/inventory\.html$/)
  })
})
