import { type Locator, type Page } from '@playwright/test'

/** Selectores del checkout — Step 1 (información) */
const INPUT_FIRST_NAME = '[data-test="firstName"]'
const INPUT_LAST_NAME = '[data-test="lastName"]'
const INPUT_POSTAL_CODE = '[data-test="postalCode"]'
const BUTTON_CONTINUE = '[data-test="continue"]'
const BUTTON_CANCEL = '[data-test="cancel"]'
const ERROR_CONTAINER = '[data-test="error"]'

/** Selectores del checkout — Step 2 (resumen) */
const BUTTON_FINISH = '[data-test="finish"]'
const LABEL_SUBTOTAL = '.summary_subtotal_label'
const LABEL_TAX = '.summary_tax_label'
const LABEL_TOTAL = '.summary_total_label'

/** Selectores del checkout — Confirmación */
const BUTTON_BACK_HOME = '[data-test="back-to-products"]'
const COMPLETE_HEADER = '.complete-header'

/**
 * Page Object Model para el flujo de checkout (3 pasos).
 *
 * Entrada:   Page autenticada en /checkout-step-one.html
 * Salida:    Métodos para completar la compra y validar montos
 */
export class CheckoutPage {
  readonly page: Page
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly postalCodeInput: Locator
  readonly continueButton: Locator
  readonly cancelButton: Locator
  readonly finishButton: Locator
  readonly backHomeButton: Locator
  readonly errorContainer: Locator
  readonly completeHeader: Locator
  readonly subtotalLabel: Locator
  readonly taxLabel: Locator
  readonly totalLabel: Locator

  constructor(page: Page) {
    this.page = page
    this.firstNameInput = page.locator(INPUT_FIRST_NAME)
    this.lastNameInput = page.locator(INPUT_LAST_NAME)
    this.postalCodeInput = page.locator(INPUT_POSTAL_CODE)
    this.continueButton = page.locator(BUTTON_CONTINUE)
    this.cancelButton = page.locator(BUTTON_CANCEL)
    this.finishButton = page.locator(BUTTON_FINISH)
    this.backHomeButton = page.locator(BUTTON_BACK_HOME)
    this.errorContainer = page.locator(ERROR_CONTAINER)
    this.completeHeader = page.locator(COMPLETE_HEADER)
    this.subtotalLabel = page.locator(LABEL_SUBTOTAL)
    this.taxLabel = page.locator(LABEL_TAX)
    this.totalLabel = page.locator(LABEL_TOTAL)
  }

  // ──────────────────────────────────────
  //   Step 1 — Información de envío
  // ──────────────────────────────────────

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName)
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName)
  }

  async fillPostalCode(code: string) {
    await this.postalCodeInput.fill(code)
  }

  /** Entrada: nombre, apellido, código postal */
  async fillCheckoutInfo(firstName: string, lastName: string, code: string) {
    await this.fillFirstName(firstName)
    await this.fillLastName(lastName)
    await this.fillPostalCode(code)
  }

  /** Continúa al Step 2 (resumen) */
  async clickContinue() {
    await this.continueButton.click()
  }

  /** Cancela el checkout y regresa al carrito */
  async clickCancel() {
    await this.cancelButton.click()
  }

  /** Obtiene el mensaje de error en el formulario */
  async getErrorMessage() {
    return (await this.errorContainer.textContent()) ?? ''
  }

  /** Espera a que el error sea visible */
  async waitForError() {
    await this.errorContainer.waitFor({ state: 'visible' })
  }

  // ──────────────────────────────────────
  //   Step 2 — Resumen de orden
  // ──────────────────────────────────────

  /** Finaliza la compra (navega a confirmación) */
  async clickFinish() {
    await this.finishButton.click()
  }

  /** Extrae un valor numérico de un label como "Item total: $29.99" */
  private parsePrice(label: Locator): Promise<number> {
    return label.textContent().then((text) => {
      const match = text?.match(/[\d.]+/)
      return match ? parseFloat(match[0]) : 0
    })
  }

  /** Salida: subtotal numérico */
  async getSubtotal() {
    return this.parsePrice(this.subtotalLabel)
  }

  /** Salida: impuesto numérico */
  async getTax() {
    return this.parsePrice(this.taxLabel)
  }

  /** Salida: total numérico */
  async getTotal() {
    return this.parsePrice(this.totalLabel)
  }

  // ──────────────────────────────────────
  //   Confirmación
  // ──────────────────────────────────────

  /** Salida: encabezado de confirmación (ej: "Thank you for your order!") */
  async getCompleteHeader() {
    return (await this.completeHeader.textContent()) ?? ''
  }

  /** Completa la orden y espera la pantalla de confirmación */
  async goToComplete() {
    await this.clickFinish()
    await this.completeHeader.waitFor({ state: 'visible' })
  }
}
