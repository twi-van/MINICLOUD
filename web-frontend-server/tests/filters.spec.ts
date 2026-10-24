import { expect, test } from '@playwright/test'

const rooms = [
  { id: 1, title: 'Phòng dưới ba', price: 2900000, amenities: ['Wifi', 'Ban công'] },
  { id: 2, title: 'Phòng đúng ba', price: 3000000, amenities: ['Wifi', 'Nội thất'] },
  { id: 3, title: 'Phòng đúng bốn', price: 4000000, amenities: ['Wifi', 'Ban công', 'Nội thất'] },
  { id: 4, title: 'Phòng trên bốn', price: 4100000, amenities: ['Ban công'] },
  { id: 5, title: 'Phòng trên tám', price: 9500000, amenities: ['Nội thất'] },
].map((room) => ({
  ...room,
  address: 'Quận 7, TP.HCM',
  area: 25,
  imageUrl: '/images/room-1.jpg',
  type: 'Studio',
  available: room.id !== 3,
}))

test.beforeEach(async ({ page }) => {
  await page.route('**/api/rooms', (route) => route.fulfill({ json: rooms }))
})

const url = 'http://127.0.0.1:4174/rooms'

test('quick amenities compose with sidebar selections and toggle independently', async ({
  page,
}) => {
  await page.goto(`${url}?amenities=Wifi&page=2`)
  await page.getByRole('button', { name: 'Có ban công', exact: true }).click()
  await expect(page.locator('.room-card')).toHaveCount(2)
  expect(new URL(page.url()).searchParams.get('page')).toBeNull()
  await page.getByRole('button', { name: 'Nội thất sẵn', exact: true }).click()
  await expect(page.locator('.room-card')).toHaveCount(1)
  await expect(page.getByRole('checkbox', { name: 'Wifi', exact: true })).toBeChecked()
  await expect(page.getByRole('button', { name: 'Có ban công', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: 'Có ban công', exact: true }).click()
  await expect(page.locator('.room-card')).toHaveCount(2)
  await expect(page.getByRole('checkbox', { name: 'Wifi', exact: true })).toBeChecked()
  await expect(page.getByRole('checkbox', { name: 'Nội thất', exact: true })).toBeChecked()
})

test('price boundaries, explicit ceiling, availability and reset', async ({ page }) => {
  await page.goto(url)
  await expect(page.locator('.room-card')).toHaveCount(5)
  await page.goto(`${url}?budget=under3`)
  await expect(page.locator('.room-card')).toHaveCount(1)
  await page.goto(`${url}?budget=3to4`)
  await expect(page.locator('.room-card')).toHaveCount(2)
  await page.getByText('Chỉ hiển thị phòng trống', { exact: true }).click()
  await expect(page.getByRole('checkbox', { name: 'Chỉ hiển thị phòng trống' })).toBeChecked()
  await expect(page.locator('.room-card')).toHaveCount(1)
  await page.goto(`${url}?budget=over4`)
  await expect(page.locator('.room-card')).toHaveCount(2)
  await page.goto(`${url}?budget=over4&maxPrice=8`)
  await expect(page.locator('.room-card')).toHaveCount(1)
  await page.getByRole('button', { name: 'Đặt lại' }).click()
  await expect(page.locator('.room-card')).toHaveCount(5)
})

test('malformed page values and padded unaccented search remain usable', async ({ page }) => {
  for (const value of ['abc', '1.5', '-2', 'Infinity', '999']) {
    await page.goto(`${url}?page=${value}`)
    await expect(page.locator('.room-card')).toHaveCount(5)
  }
  await page
    .getByRole('textbox', { name: 'Tìm theo tên phòng, địa chỉ' })
    .fill('   phong   dung   bon  ')
  await expect(page.locator('.room-card')).toHaveCount(1)
  await expect(page.locator('.room-card')).toContainText('Phòng đúng bốn')
})

test('pagination and sort preserve filters; changing a filter returns to page one', async ({
  page,
}) => {
  const manyRooms = Array.from({ length: 13 }, (_, index) => ({
    ...rooms[0],
    id: index + 1,
    title: `Phòng thử ${index + 1}`,
    price: 2000000 + index * 100000,
  }))
  await page.route('**/api/rooms', (route) => route.fulfill({ json: manyRooms }))
  await page.goto(`${url}?type=Studio&sort=price-desc&page=2`)
  await expect(page.locator('.room-card')).toHaveCount(6)
  await expect(page.locator('.room-card').first()).toContainText('Phòng thử 7')
  await page.getByTitle('3', { exact: true }).click()
  await expect(page.locator('.room-card')).toHaveCount(1)
  expect(new URL(page.url()).searchParams.get('type')).toBe('Studio')
  expect(new URL(page.url()).searchParams.get('sort')).toBe('price-desc')
  await page.getByRole('button', { name: 'Có ban công', exact: true }).click()
  await expect(page.locator('.room-card')).toHaveCount(6)
  expect(new URL(page.url()).searchParams.get('page')).toBeNull()
})
