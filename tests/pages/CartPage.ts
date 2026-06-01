import { type Locator, type Page } from '@playwright/test'
import type { Product } from '../data/products'

/** Selectores de la página del carrito */
const CART_LIST = '[data-test="cart-list"]'
const CART_ITEM = '[data-test="inventory-item"]'
const CART_BADGE = '[data-test="shopping-cart-badge"]'
const CHECKOUT_BUTTON = '[data-test="checkout"]'
const CONTINUE_SHOPPING = '[data-test="continue-shopping"]'

/**
 * Page Object Model para la página del carrito de compras (/cart.html).
 *
 * Entrada:   Page autenticada en /cart.html
 * Salida:    Métodos para gestionar productos en el carrito
 */
export class CartPage {
  readonly page: Page
  readonly cartList: Locator
  readonly cartItems: Locator
  readonly cartBadge: Locator
  readonly checkoutButton: Locator
  readonly continueShopping: Locator

  constructor(page: Page) {
    this.page = page
    this.cartList = page.locator(CART_LIST)
    this.cartItems = page.locator(CART_ITEM)
    this.cartBadge = page.locator(CART_BADGE)
    this.checkoutButton = page.locator(CHECKOUT_BUTTON)
    this.continueShopping = page.locator(CONTINUE_SHOPPING)
  }

  /** Navega directamente a /cart.html */
  async goto() {
    await this.page.goto('/cart.html')
  }

  /** Espera a que la lista del carrito esté visible */
  async isLoaded() {
    await this.cartList.waitFor({ state: 'visible' })
  }

  /** Salida: cantidad de productos en el carrito */
  async getItemCount() {
    return await this.cartItems.count()
  }

  /**
   * Remueve un producto del carrito.
   * Entrada: producto definido en data/products
   */
  async removeProduct(product: Product) {
    await this.page.locator(`[data-test="remove-${product.id}"]`).click()
  }

  /** Salida: número del badge en el ícono del carrito (0 si oculto) */
  async getBadgeCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible()
    if (!visible) return 0
    const text = await this.cartBadge.textContent()
    return text ? parseInt(text, 10) : 0
  }

  /** Navega al checkout (Step 1) */
  async goToCheckout() {
    await this.checkoutButton.click()
  }

  /** Regresa al inventario */
  async clickContinueShopping() {
    await this.continueShopping.click()
  }
}
