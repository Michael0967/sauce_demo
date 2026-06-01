import { test, expect } from '../fixtures/base'
import { PASSWORD, VALID_USERS, LOCKED_OUT_USER, ERROR_MESSAGES } from '../data/users'

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto()
  })

  test.describe('valid credentials', () => {
    for (const user of VALID_USERS) {
      test(`${user.description} logs in and lands on inventory`, async ({ loginPage, inventoryPage }) => {
        await loginPage.login(user.username, PASSWORD)
        await inventoryPage.isLoaded()

        await expect(inventoryPage.page).toHaveURL(/\/inventory\.html$/)
      })
    }

    test('locked out user sees lockout error', async ({ loginPage }) => {
      await loginPage.login(LOCKED_OUT_USER.username, PASSWORD)
      await loginPage.waitForError()

      const message = await loginPage.getErrorMessage()
      expect(message).toContain(ERROR_MESSAGES.LOCKED_OUT)
      await expect(loginPage.page).not.toHaveURL(/\/inventory\.html$/)
    })
  })

  test.describe('invalid credentials', () => {
    test('shows error with wrong password', async ({ loginPage }) => {
      await loginPage.login('standard_user', 'wrong_password')
      await loginPage.waitForError()

      const message = await loginPage.getErrorMessage()
      expect(message).toContain(ERROR_MESSAGES.WRONG_CREDENTIALS)
    })

    test('shows error with blank username', async ({ loginPage }) => {
      await loginPage.login('', PASSWORD)
      await loginPage.waitForError()

      const message = await loginPage.getErrorMessage()
      expect(message).toContain(ERROR_MESSAGES.USERNAME_REQUIRED)
    })

    test('shows error with blank password', async ({ loginPage }) => {
      await loginPage.login('standard_user', '')
      await loginPage.waitForError()

      const message = await loginPage.getErrorMessage()
      expect(message).toContain(ERROR_MESSAGES.PASSWORD_REQUIRED)
    })

    test('shows error with both fields blank', async ({ loginPage }) => {
      await loginPage.login('', '')
      await loginPage.waitForError()

      const message = await loginPage.getErrorMessage()
      expect(message).toContain(ERROR_MESSAGES.USERNAME_REQUIRED)
    })
  })

  test.describe('error dismissal', () => {
    test('error clears after clicking close button', async ({ loginPage }) => {
      await loginPage.login('standard_user', 'wrong_password')
      await loginPage.waitForError()
      await loginPage.dismissError()

      await expect(loginPage.errorContainer).not.toBeVisible()
    })
  })
})
