import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { PASSWORD } from '../data/users'

test.describe('Performance', () => {
  test('standard_user login completes within acceptable time', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await loginPage.goto()
    const start = Date.now()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()
    const elapsed = Date.now() - start

    console.log(`[PERF] standard_user login → inventory: ${elapsed}ms`)
    expect(elapsed).toBeLessThan(5000)
  })

  test('performance_glitch_user login is noticeably slower than standard_user', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await loginPage.goto()
    const startStandard = Date.now()
    await loginPage.login('standard_user', PASSWORD)
    await inventoryPage.isLoaded()
    const standardTime = Date.now() - startStandard
    console.log(`[PERF] standard_user: ${standardTime}ms`)

    await inventoryPage.logout()
    await loginPage.goto()

    const startGlitch = Date.now()
    await loginPage.login('performance_glitch_user', PASSWORD)
    await inventoryPage.isLoaded()
    const glitchTime = Date.now() - startGlitch
    console.log(`[PERF] performance_glitch_user: ${glitchTime}ms`)

    expect(glitchTime).toBeGreaterThan(standardTime)
  })
})
