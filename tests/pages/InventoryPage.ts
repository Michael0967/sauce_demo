import { type Locator, type Page } from '@playwright/test'
import type { Product } from '../data/products'

/** Selectores de la página de inventario */
const INVENTORY_LIST = '[data-test="inventory-list"]'
const INVENTORY_ITEM = '[data-test="inventory-item"]'
const ITEM_NAME = '[data-test="inventory-item-name"]'
const ITEM_PRICE = '[data-test="inventory-item-price"]'
const ITEM_IMAGE = 'img.inventory_item_img'
const SORT_SELECT = '[data-test="product-sort-container"]'
const CART_BADGE = '[data-test="shopping-cart-badge"]'
const CART_LINK = '[data-test="shopping-cart-link"]'

/** Selectores del menú lateral (burger menu) */
const BURGER_MENU_BTN = '#react-burger-menu-btn'
const LOGOUT_LINK = '#logout_sidebar_link'
const RESET_APP_LINK = '#reset_sidebar_link'

/**
 * Page Object Model para el inventario de productos.
 *
 * Entrada:   Page autenticada en /inventory.html
 * Salida:    Métodos para sortear, agregar al carrito, consultar productos y cerrar sesión
 */
export class InventoryPage {
  readonly page: Page
  readonly inventoryList: Locator
  readonly inventoryItems: Locator
  readonly sortSelect: Locator
  readonly cartBadge: Locator
  readonly cartLink: Locator
  readonly burgerMenuButton: Locator
  readonly logoutLink: Locator
  readonly resetAppLink: Locator

  constructor(page: Page) {
    this.page = page
    this.inventoryList = page.locator(INVENTORY_LIST)
    this.inventoryItems = page.locator(INVENTORY_ITEM)
    this.sortSelect = page.locator(SORT_SELECT)
    this.cartBadge = page.locator(CART_BADGE)
    this.cartLink = page.locator(CART_LINK)
    this.burgerMenuButton = page.locator(BURGER_MENU_BTN)
    this.logoutLink = page.locator(LOGOUT_LINK)
    this.resetAppLink = page.locator(RESET_APP_LINK)
  }

  /** Espera a que la lista de productos esté visible */
  async isLoaded() {
    await this.inventoryList.waitFor({ state: 'visible' })
  }

  /** Salida: cantidad de productos visibles en la cuadrícula */
  async getItemCount() {
    return await this.inventoryItems.count()
  }

  /** Salida: arreglo con los nombres de todos los productos visibles */
  async getProductNames(): Promise<string[]> {
    return await this.page.locator(ITEM_NAME).allTextContents()
  }

  /** Salida: arreglo con los precios numéricos de todos los productos */
  async getPrices(): Promise<number[]> {
    const texts = await this.page.locator(ITEM_PRICE).allTextContents()
    return texts.map((t) => parseFloat(t.replace('$', '')))
  }

  /** Salida: arreglo con las URLs completas de las imágenes de cada producto */
  async getImageSources(): Promise<string[]> {
    const images = this.page.locator(INVENTORY_ITEM).locator(ITEM_IMAGE)
    return await images.evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).src)
    )
  }

  /**
   * Selecciona una opción de ordenamiento.
   * Entrada: valor del option (lohi, hilo, az, za)
   */
  async sortBy(value: string) {
    await this.sortSelect.selectOption(value)
  }

  /**
   * Agrega un producto al carrito.
   * Entrada: producto definido en data/products
   */
  async addToCart(product: Product) {
    await this.page.locator(`[data-test="add-to-cart-${product.id}"]`).click()
  }

  /**
   * Remueve un producto del carrito.
   * Entrada: producto definido en data/products
   */
  async removeFromCart(product: Product) {
    await this.page.locator(`[data-test="remove-${product.id}"]`).click()
  }

  /**
   * Obtiene el texto del botón "Add to cart" de un producto.
   * Útil para validar que el texto cambia a "Remove" después de agregar.
   * Entrada: producto
   * Salida:  texto del botón
   */
  async getAddToCartButtonText(product: Product) {
    return await this.page
      .locator(`[data-test="add-to-cart-${product.id}"]`)
      .textContent()
  }

  /** Salida: número del badge del carrito (0 si no está visible) */
  async getCartBadgeCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible()
    if (!visible) return 0
    const text = await this.cartBadge.textContent()
    return text ? parseInt(text, 10) : 0
  }

  /** Navega a la página del carrito */
  async goToCart() {
    await this.cartLink.click()
  }

  /** Abre el menú lateral (burger menu) */
  async openBurgerMenu() {
    await this.burgerMenuButton.click()
  }

  /** Cierra sesión a través del menú lateral */
  async logout() {
    await this.openBurgerMenu()
    await this.logoutLink.click()
  }

  /** Resetea el estado de la aplicación (limpia el carrito) */
  async resetAppState() {
    await this.openBurgerMenu()
    await this.resetAppLink.click()
  }
}
