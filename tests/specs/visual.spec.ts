import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { PASSWORD } from '../data/users'

test.describe('Visual Regression', () => {
  test('login page matches snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
    })
  })

  test('login page with error matches snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'wrong')
    await loginPage.waitForError()
    await expect(page).toHaveScreenshot('login-error.png', {
      fullPage: true,
    })
  })

  test('inventory page matches snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await loginPage.goto()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()
    await expect(page).toHaveScreenshot('inventory-page.png', {
      fullPage: true,
    })
  })
})
