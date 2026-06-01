import { test, expect } from '../fixtures/base'
import { PASSWORD } from '../data/users'

test.describe('Visual Regression', () => {
  test('login page matches snapshot', async ({ loginPage }) => {
    await loginPage.goto()
    await expect(loginPage.page).toHaveScreenshot('login-page.png', {
      fullPage: true,
    })
  })

  test('login page with error matches snapshot', async ({ loginPage }) => {
    await loginPage.goto()
    await loginPage.login('standard_user', 'wrong')
    await loginPage.waitForError()
    await expect(loginPage.page).toHaveScreenshot('login-error.png', {
      fullPage: true,
    })
  })

  test('inventory page matches snapshot', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()
    await expect(inventoryPage.page).toHaveScreenshot('inventory-page.png', {
      fullPage: true,
    })
  })
})
