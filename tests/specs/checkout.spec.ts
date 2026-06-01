import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { PASSWORD } from '../data/users'
import { PRODUCTS } from '../data/products'

const [BACKPACK] = PRODUCTS

test.describe('Checkout', () => {
  let checkoutPage: CheckoutPage
  let cartPage: CartPage

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)
    cartPage = new CartPage(page)
    checkoutPage = new CheckoutPage(page)

    await loginPage.goto()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()

    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.goToCart()
    await cartPage.isLoaded()
    await cartPage.goToCheckout()
  })

  test.describe('validation errors', () => {
    test('shows error with empty first name', async () => {
      await checkoutPage.fillCheckoutInfo('', 'Doe', '12345')
      await checkoutPage.clickContinue()
      await checkoutPage.waitForError()

      const message = await checkoutPage.getErrorMessage()
      expect(message).toContain('First Name is required')
    })

    test('shows error with empty last name', async () => {
      await checkoutPage.fillCheckoutInfo('John', '', '12345')
      await checkoutPage.clickContinue()
      await checkoutPage.waitForError()

      const message = await checkoutPage.getErrorMessage()
      expect(message).toContain('Last Name is required')
    })

    test('shows error with empty postal code', async () => {
      await checkoutPage.fillCheckoutInfo('John', 'Doe', '')
      await checkoutPage.clickContinue()
      await checkoutPage.waitForError()

      const message = await checkoutPage.getErrorMessage()
      expect(message).toContain('Postal Code is required')
    })
  })

  test('cancel returns to cart', async () => {
    await checkoutPage.clickCancel()
    await cartPage.isLoaded()
  })

  test('successful checkout shows confirmation', async () => {
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345')
    await checkoutPage.clickContinue()
    await checkoutPage.goToComplete()

    const message = await checkoutPage.getCompleteHeader()
    expect(message).toBe('Thank you for your order!')
  })

  test('price calculation: subtotal + tax = total', async () => {
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345')
    await checkoutPage.clickContinue()

    const subtotal = await checkoutPage.getSubtotal()
    const tax = await checkoutPage.getTax()
    const total = await checkoutPage.getTotal()

    expect(total).toBeCloseTo(subtotal + tax, 2)
  })
})
