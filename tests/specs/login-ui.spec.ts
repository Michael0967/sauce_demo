import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { PASSWORD } from '../data/users'

test.describe('Login — UI & edge cases', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('password field is masked', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.fillPassword(PASSWORD)
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')
  })

  test.describe('session', () => {
    test('logout clears session and returns to login', async ({ page }) => {
      const loginPage = new LoginPage(page)
      const inventoryPage = new InventoryPage(page)

      await loginPage.login('standard_user', PASSWORD)
      await inventoryPage.isLoaded()
      await inventoryPage.logout()

      await expect(loginPage.loginButton).toBeVisible()
    })
  })
})
