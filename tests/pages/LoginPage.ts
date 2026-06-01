import { type Locator, type Page } from '@playwright/test'

/** Selectores encapsulados del formulario de login */
const INPUT_USERNAME = '[data-test="username"]'
const INPUT_PASSWORD = '[data-test="password"]'
const BUTTON_LOGIN = '[data-test="login-button"]'
const ERROR_CONTAINER = '[data-test="error"]'
const BUTTON_ERROR_CLOSE = '.error-button'

/**
 * Page Object Model para la página de login de SauceDemo.
 *
 * Entrada:   Page de Playwright
 * Salida:    Métodos para interactuar con el formulario de autenticación
 */
export class LoginPage {
  readonly page: Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly errorContainer: Locator
  readonly errorCloseButton: Locator

  constructor(page: Page) {
    this.page = page
    this.usernameInput = page.locator(INPUT_USERNAME)
    this.passwordInput = page.locator(INPUT_PASSWORD)
    this.loginButton = page.locator(BUTTON_LOGIN)
    this.errorContainer = page.locator(ERROR_CONTAINER)
    this.errorCloseButton = page.locator(BUTTON_ERROR_CLOSE)
  }

  /** Navega a la raíz del sitio (página de login) */
  async goto() {
    await this.page.goto('/')
  }

  /** Llena el campo de usuario */
  async fillUsername(username: string) {
    await this.usernameInput.fill(username)
  }

  /** Llena el campo de contraseña */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password)
  }

  /** Hace clic en el botón Login */
  async clickLogin() {
    await this.loginButton.click()
  }

  /**
   * Flujo completo de login.
   * Entrada: username y password
   * Salida:  Redirección a /inventory.html (si las credenciales son válidas)
   */
  async login(username: string, password: string) {
    await this.fillUsername(username)
    await this.fillPassword(password)
    await this.clickLogin()
  }

  /**
   * Obtiene el texto del mensaje de error.
   * Salida: string con el mensaje (vacío si no hay error visible)
   */
  async getErrorMessage() {
    return (await this.errorContainer.textContent()) ?? ''
  }

  /** Indica si el contenedor de error está visible */
  async isErrorVisible() {
    return await this.errorContainer.isVisible()
  }

  /** Espera a que el mensaje de error sea visible */
  async waitForError() {
    await this.errorContainer.waitFor({ state: 'visible' })
  }

  /** Cierra el mensaje de error haciendo clic en la X */
  async dismissError() {
    if (await this.errorCloseButton.isVisible()) {
      await this.errorCloseButton.click()
    }
  }
}
