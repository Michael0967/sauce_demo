import { test, expect } from '../fixtures/base'
import { PASSWORD } from '../data/users'
import { PRODUCTS } from '../data/products'

const [BACKPACK] = PRODUCTS

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
    await loginPage.goto()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()

    await inventoryPage.addToCart(BACKPACK)
    await inventoryPage.goToCart()
    await cartPage.isLoaded()
    await cartPage.goToCheckout()
  })

  test.describe('validation errors', () => {
    test('shows error with empty first name', async ({ checkoutPage }) => {
      await checkoutPage.fillCheckoutInfo('', 'Doe', '12345')
      await checkoutPage.clickContinue()
      await checkoutPage.waitForError()

      const message = await checkoutPage.getErrorMessage()
      expect(message).toContain('First Name is required')
    })

    test('shows error with empty last name', async ({ checkoutPage }) => {
      await checkoutPage.fillCheckoutInfo('John', '', '12345')
      await checkoutPage.clickContinue()
      await checkoutPage.waitForError()

      const message = await checkoutPage.getErrorMessage()
      expect(message).toContain('Last Name is required')
    })

    test('shows error with empty postal code', async ({ checkoutPage }) => {
      await checkoutPage.fillCheckoutInfo('John', 'Doe', '')
      await checkoutPage.clickContinue()
      await checkoutPage.waitForError()

      const message = await checkoutPage.getErrorMessage()
      expect(message).toContain('Postal Code is required')
    })
  })

  test('cancel returns to cart', async ({ checkoutPage, cartPage }) => {
    await checkoutPage.clickCancel()
    await cartPage.isLoaded()
  })

  test('successful checkout shows confirmation', async ({ checkoutPage }) => {
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345')
    await checkoutPage.clickContinue()
    await checkoutPage.goToComplete()

    const message = await checkoutPage.getCompleteHeader()
    expect(message).toBe('Thank you for your order!')
  })

  test('price calculation: subtotal + tax = total', async ({ checkoutPage }) => {
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345')
    await checkoutPage.clickContinue()

    const subtotal = await checkoutPage.getSubtotal()
    const tax = await checkoutPage.getTax()
    const total = await checkoutPage.getTotal()

    expect(total).toBeCloseTo(subtotal + tax, 2)
  })
})
