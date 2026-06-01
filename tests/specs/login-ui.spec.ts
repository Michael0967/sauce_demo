import { test, expect } from '../fixtures/base'
import { PASSWORD } from '../data/users'

test.describe('Login — UI & edge cases', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto()
  })

  test('password field is masked', async ({ loginPage }) => {
    await loginPage.fillPassword(PASSWORD)
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')
  })

  test.describe('session', () => {
    test('logout clears session and returns to login', async ({ loginPage, inventoryPage }) => {
      await loginPage.login('standard_user', PASSWORD)
      await inventoryPage.isLoaded()
      await inventoryPage.logout()

      await expect(loginPage.loginButton).toBeVisible()
    })
  })
})
