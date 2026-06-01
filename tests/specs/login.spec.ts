import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { PASSWORD, VALID_USERS, LOCKED_OUT_USER, ERROR_MESSAGES } from '../data/users'

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test.describe('valid credentials', () => {
    for (const user of VALID_USERS) {
      test(`${user.description} logs in and lands on inventory`, async ({ page }) => {
        const loginPage = new LoginPage(page)
        const inventoryPage = new InventoryPage(page)

        await loginPage.login(user.username, PASSWORD)
        await inventoryPage.isLoaded()

        await expect(page).toHaveURL(/\/inventory\.html$/)
      })
    }

    test('locked out user sees lockout error', async ({ page }) => {
      const loginPage = new LoginPage(page)

      await loginPage.login(LOCKED_OUT_USER.username, PASSWORD)
      await loginPage.waitForError()

      const message = await loginPage.getErrorMessage()
      expect(message).toContain(ERROR_MESSAGES.LOCKED_OUT)
      await expect(page).not.toHaveURL(/\/inventory\.html$/)
    })
  })

  test.describe('invalid credentials', () => {
    test('shows error with wrong password', async ({ page }) => {
      const loginPage = new LoginPage(page)
      await loginPage.login('standard_user', 'wrong_password')
      await loginPage.waitForError()

      const message = await loginPage.getErrorMessage()
      expect(message).toContain(ERROR_MESSAGES.WRONG_CREDENTIALS)
    })

    test('shows error with blank username', async ({ page }) => {
      const loginPage = new LoginPage(page)
      await loginPage.login('', PASSWORD)
      await loginPage.waitForError()

      const message = await loginPage.getErrorMessage()
      expect(message).toContain(ERROR_MESSAGES.USERNAME_REQUIRED)
    })

    test('shows error with blank password', async ({ page }) => {
      const loginPage = new LoginPage(page)
      await loginPage.login('standard_user', '')
      await loginPage.waitForError()

      const message = await loginPage.getErrorMessage()
      expect(message).toContain(ERROR_MESSAGES.PASSWORD_REQUIRED)
    })

    test('shows error with both fields blank', async ({ page }) => {
      const loginPage = new LoginPage(page)
      await loginPage.login('', '')
      await loginPage.waitForError()

      const message = await loginPage.getErrorMessage()
      expect(message).toContain(ERROR_MESSAGES.USERNAME_REQUIRED)
    })
  })

  test.describe('error dismissal', () => {
    test('error clears after clicking close button', async ({ page }) => {
      const loginPage = new LoginPage(page)

      await loginPage.login('standard_user', 'wrong_password')
      await loginPage.waitForError()
      await loginPage.dismissError()

      await expect(loginPage.errorContainer).not.toBeVisible()
    })
  })
})
