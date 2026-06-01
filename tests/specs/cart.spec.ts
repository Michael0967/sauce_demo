import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { CartPage } from '../pages/CartPage'
import { PASSWORD } from '../data/users'
import { PRODUCTS } from '../data/products'

const [BACKPACK, BIKE_LIGHT, BOLT_SHIRT] = PRODUCTS

test.describe('Cart', () => {
  let inventoryPage: InventoryPage
  let cartPage: CartPage

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    inventoryPage = new InventoryPage(page)
    cartPage = new CartPage(page)

    await loginPage.goto()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()
  })

  test('add single product shows badge count of 1', async () => {
    await inventoryPage.addToCart(BACKPACK)
    const badge = await inventoryPage.getCartBadgeCount()
    expect(badge).toBe(1)
  })

  test('add multiple products shows correct badge count', async () => {
    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.addToCart(BIKE_LIGHT)
    await inventoryPage.addToCart(BOLT_SHIRT)

    const badge = await inventoryPage.getCartBadgeCount()
    expect(badge).toBe(3)
  })

  test('remove product clears badge', async () => {
    await inventoryPage.addToCart(BACKPACK)
    const badgeAfterAdd = await inventoryPage.getCartBadgeCount()
    expect(badgeAfterAdd).toBe(1)

    await inventoryPage.removeFromCart(BACKPACK)
    const badgeAfterRemove = await inventoryPage.getCartBadgeCount()
    expect(badgeAfterRemove).toBe(0)
  })

  test('cart page reflects added products', async () => {
    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.addToCart(BIKE_LIGHT)
    await inventoryPage.goToCart()
    await cartPage.isLoaded()

    const count = await cartPage.getItemCount()
    expect(count).toBe(2)
  })

  test('remove from cart page updates count', async () => {
    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.addToCart(BIKE_LIGHT)
    await inventoryPage.goToCart()
    await cartPage.isLoaded()

    await cartPage.removeProduct(BACKPACK)
    const count = await cartPage.getItemCount()
    expect(count).toBe(1)
  })

  test('continue shopping returns to inventory', async () => {
    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.goToCart()
    await cartPage.isLoaded()
    await cartPage.clickContinueShopping()

    await inventoryPage.isLoaded()
    await expect(inventoryPage.page).toHaveURL(/\/inventory\.html$/)
  })
})
