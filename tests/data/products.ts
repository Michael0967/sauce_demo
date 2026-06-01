export interface Product {
  id: string
  name: string
  expectedImage: string
  price: number
}

export const PRODUCTS: Product[] = [
  { id: 'sauce-labs-backpack', name: 'Sauce Labs Backpack', expectedImage: 'sauce-backpack', price: 29.99 },
  { id: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light', expectedImage: 'bike-light', price: 9.99 },
  { id: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt', expectedImage: 'bolt-shirt', price: 15.99 },
  { id: 'sauce-labs-fleece-jacket', name: 'Sauce Labs Fleece Jacket', expectedImage: 'sauce-pullover', price: 49.99 },
  { id: 'sauce-labs-onesie', name: 'Sauce Labs Onesie', expectedImage: 'red-onesie', price: 7.99 },
  { id: 'test.allthethings()-t-shirt-(red)', name: 'Test.allTheThings() T-Shirt (Red)', expectedImage: 'red-tatt', price: 15.99 },
]

export const SORT_OPTIONS = {
  NAME_AZ: 'az',
  NAME_ZA: 'za',
  PRICE_LOW_HIGH: 'lohi',
  PRICE_HIGH_LOW: 'hilo',
} as const
