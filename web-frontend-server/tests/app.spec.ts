import { expect, test } from '@playwright/test'

test('home is self-contained and routes into a filtered search', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const errors: string[] = []
  const apiCalls: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('request', (request) => {
    if (request.url().includes('/api/')) apiCalls.push(request.url())
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ở đúng gu.')
  await expect(page.locator('.room-card')).toHaveCount(3)
  await page.locator('img').evaluateAll((images) =>
    images.forEach((img) => {
      img.loading = 'eager'
    }),
  )
  await page.waitForFunction(() => [...document.images].every((img) => img.complete))
  await expect(page.locator('.hero-main-image')).toBeVisible()
  expect(
    await page
      .locator('.hero-main-image')
      .evaluate((img) => (img as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0)
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true })
  await page.locator('#search-district').click()
  await page.getByTitle('Quận 7', { exact: true }).click()
  await page.getByRole('button', { name: /Tìm phòng/ }).click()
  await expect(page).toHaveURL(/district=/)
  await expect(page.locator('.room-card')).toHaveCount(2)
  expect(errors).toEqual([])
  expect(apiCalls).toEqual([])
})

test('room filters, sort, pagination and empty-state reset work', async ({ page }) => {
  await page.goto('/rooms')
  await expect(page.locator('.room-card')).toHaveCount(6)
  await page.getByTitle('2', { exact: true }).click()
  await expect(page.locator('.room-card')).toHaveCount(2)
  await page.goto('/rooms?budget=under3&sort=price-asc')
  await expect(page.locator('.room-card')).toHaveCount(4)
  await expect(page.locator('.room-card').first()).toContainText('2,2 triệu')
  await page.getByRole('textbox', { name: 'Tìm theo tên phòng, địa chỉ' }).fill('zzzzzz')
  await expect(page.getByText('Chưa có phòng phù hợp.')).toBeVisible()
  await page.getByRole('button', { name: 'Xem tất cả phòng' }).click()
  await expect(page.locator('.room-card')).toHaveCount(6)
})

test('favorites survive refresh and can be removed', async ({ page }) => {
  await page.goto('/rooms')
  await page
    .getByRole('button', { name: 'Lưu Studio ngập nắng, một góc bình yên', exact: true })
    .click()
  await page.reload()
  await page.getByRole('button', { name: 'Đã lưu (1)' }).click()
  await expect(page.locator('.room-card')).toHaveCount(1)
  await page
    .getByRole('button', { name: 'Bỏ lưu Studio ngập nắng, một góc bình yên', exact: true })
    .click()
  await expect(page.getByText('Chưa có phòng đã lưu phù hợp')).toBeVisible()
})

test('details support deep links, gallery and missing rooms', async ({ page }) => {
  await page.goto('/rooms/1')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Studio ngập nắng, một góc bình yên',
  )
  await expect(page.locator('.detail-gallery .ant-image')).toHaveCount(3)
  await page.screenshot({ path: 'test-results/detail-desktop.png', fullPage: true })
  await page.getByRole('button', { name: 'Hẹn xem phòng (demo)' }).click()
  await expect(page).toHaveURL(/login\?redirect=/)
  await page.goto('/rooms/999')
  await expect(page.getByText('Không tìm thấy phòng này.')).toBeVisible()
})

test('three complete blog articles and search are available', async ({ page }) => {
  await page.goto('/blog/')
  await expect(page.locator('article')).toHaveCount(3)
  await page.getByRole('textbox', { name: 'Tìm bài viết' }).fill('ngân sách')
  await expect(page.locator('article')).toHaveCount(1)
  await page.getByRole('link', { name: 'Đọc bài viết' }).click()
  await expect(page.locator('article section')).toHaveCount(3)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Một tháng ở trọ')
})

test('students paginate and search without a backend', async ({ page }) => {
  await page.goto('/students')
  await expect(page.locator('tbody .ant-table-row')).toHaveCount(10)
  await page.getByTitle('2', { exact: true }).click()
  await expect(page.locator('tbody .ant-table-row').first()).toContainText('11')
  await page.getByRole('textbox', { name: 'Tìm tên sinh viên' }).fill('Hoang E')
  await expect(page.locator('tbody .ant-table-row')).toHaveCount(1)
  await expect(page.locator('tbody')).toContainText('3.70')
})

test('register validates confirmation and creates only an ephemeral demo session', async ({
  page,
}) => {
  await page.goto('/register')
  await page.getByRole('textbox', { name: 'Họ và tên' }).fill('Minh Anh')
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('anh@example.com')
  await page.getByLabel('Mật khẩu trải nghiệm', { exact: true }).fill('demo123')
  await page.getByLabel('Nhập lại mật khẩu', { exact: true }).fill('different')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Tạo phiên trải nghiệm' }).click()
  await expect(page.getByText('Hai mật khẩu chưa khớp.')).toBeVisible()
  await page.getByLabel('Nhập lại mật khẩu', { exact: true }).fill('demo123')
  await page.getByRole('button', { name: 'Tạo phiên trải nghiệm' }).click()
  await expect(page).toHaveURL(/\/rooms$/)
  await expect(page.getByText('Bạn đang dùng tài khoản trải nghiệm.')).toBeVisible()
  const storage = await page.evaluate(() => JSON.stringify(localStorage))
  expect(storage).not.toContain('demo123')
  await page.reload()
  await expect(page.getByRole('link', { name: 'Đăng nhập', exact: true })).toBeVisible()
})

test('login returns to the selected room and visit form stays explicitly simulated', async ({
  page,
}) => {
  await page.goto('/login?redirect=%2Frooms%2F1')
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('test@example.com')
  await page.getByLabel('Mật khẩu trải nghiệm', { exact: true }).fill('demo123')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Đăng nhập trải nghiệm' }).click()
  await expect(page).toHaveURL(/\/rooms\/1$/)
  await page.getByRole('button', { name: 'Hẹn xem phòng (demo)' }).click()
  await page.getByRole('textbox', { name: 'Số điện thoại mẫu' }).fill('0900000000')
  await page.getByRole('textbox', { name: 'Ngày xem phòng' }).fill('30/10/2030')
  await page.getByRole('textbox', { name: 'Ngày xem phòng' }).press('Enter')
  await expect(page.getByText('Đã mô phỏng lịch xem phòng')).toBeVisible()
})

test('mobile layout has no horizontal overflow and navigation/filters work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of ['/', '/rooms', '/rooms/1', '/blog', '/students', '/login', '/register']) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      route,
    ).toBe(true)
    if (route === '/') {
      await expect(page.locator('.room-card')).toHaveCount(3)
      await page.locator('img').evaluateAll((images) =>
        images.forEach((img) => {
          img.loading = 'eager'
        }),
      )
      await page.waitForFunction(() => [...document.images].every((img) => img.complete))
      await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true })
      await page.screenshot({ path: 'test-results/home-mobile-viewport.png' })
    }
    if (route === '/rooms') {
      await page.getByRole('button', { name: /Bộ lọc/ }).click()
      await expect(page.getByRole('complementary', { name: 'Bộ lọc phòng' })).toBeVisible()
    }
  }
  await page.getByRole('button', { name: 'Mở menu' }).click()
  await page.getByRole('dialog').getByRole('link', { name: 'Tìm phòng', exact: true }).click()
  await expect(page).toHaveURL(/\/rooms$/)
})

test('vibe tabs switch the featured selection and ticker can be paused', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.room-card')).toHaveCount(3)
  await page.getByRole('button', { name: /Team mê gác/ }).click()
  await expect(page.locator('.room-card')).toHaveCount(2)
  await expect(page.locator('.room-type-sticker').first()).toHaveText('Có gác')
  await page.getByRole('button', { name: /Tất cả vibe/ }).click()
  await expect(page.locator('.room-card')).toHaveCount(3)
  await page.getByRole('button', { name: 'Tạm dừng chữ chạy' }).click()
  await expect(page.getByRole('button', { name: 'Tiếp tục chữ chạy' })).toBeVisible()
  expect(
    await page.locator('.ticker-track').evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe('paused')
})

test('vibe quiz keeps answers and opens matching room filters', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Tìm gu của mình/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('button', { name: /Tiếp nè/ })).toBeDisabled()
  await dialog.getByRole('button', { name: /Studio riêng tư/ }).click()
  await dialog.getByRole('button', { name: /Tiếp nè/ }).click()
  await dialog.getByRole('button', { name: /Từ 3 đến 4 triệu/ }).click()
  await dialog.getByRole('button', { name: /Quay lại/ }).click()
  await expect(dialog.getByRole('button', { name: /Studio riêng tư/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await dialog.getByRole('button', { name: /Tiếp nè/ }).click()
  await dialog.getByRole('button', { name: /Tiếp nè/ }).click()
  await dialog.getByRole('button', { name: /Quận 7/ }).click()
  await page.screenshot({ path: 'test-results/vibe-quiz.png' })
  await dialog.getByRole('button', { name: /Xem phòng hợp gu/ }).click()
  await expect(page).toHaveURL(/type=Studio&budget=3to4&district=/)
  await expect(page.locator('.room-card')).toHaveCount(2)
})

test('quick search supports keyboard selection, escape and mobile trigger', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Control+k')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  const input = dialog.getByRole('textbox', { name: 'Tìm phòng nhanh' })
  await input.fill('Quận 7')
  await expect(dialog.locator('.quick-result')).toHaveCount(2)
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(page).toHaveURL(/\/rooms\/7$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Studio thoáng sáng')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Tìm nhanh', exact: true }).click()
  await expect(input).toBeFocused()
  await input.fill('khong-co-phong-nao')
  await expect(dialog.getByText('Chưa tìm thấy. Thử một từ khóa khác nhé!')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
})

test('suggested filters toggle and reduced motion is respected at 320px', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(
    await page.locator('.ticker-track').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.goto('/rooms')
  await page.getByRole('button', { name: /Dưới 3 triệu/ }).click()
  await expect(page.locator('.room-card')).toHaveCount(4)
  await page.getByRole('button', { name: /Dưới 3 triệu/ }).click()
  await expect(page.locator('.room-card')).toHaveCount(6)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('api adapter accepts minimal agreed room and student DTOs', async ({ page }) => {
  await page.route('**/api/rooms', (route) =>
    route.fulfill({
      json: [
        {
          id: 21,
          title: 'Phòng từ backend',
          address: 'Quận 7, TP.HCM',
          price: 3500000,
          area: 25,
          imageUrl: '/images/room-1.jpg',
        },
      ],
    }),
  )
  await page.route('**/api/rooms/21', (route) =>
    route.fulfill({
      json: {
        id: 21,
        title: 'Phòng từ backend',
        address: 'Quận 7, TP.HCM',
        price: 3500000,
        area: 25,
        imageUrl: '/images/room-1.jpg',
        description: 'Mô tả từ backend',
      },
    }),
  )
  await page.goto('http://127.0.0.1:4174/rooms')
  await expect(page.locator('.room-card')).toHaveCount(1)
  await page.getByRole('heading', { name: 'Phòng từ backend' }).getByRole('link').click()
  await expect(page.getByText('Mô tả từ backend')).toBeVisible()
  await page.route('**/api/student', (route) =>
    route.fulfill({ json: [{ id: 1, name: 'API Student', major: 'CNTT', gpa: 3.5 }] }),
  )
  await page.goto('http://127.0.0.1:4174/students')
  await expect(page.locator('tbody')).toContainText('API Student')
})

test('api errors expose retry without silently falling back to mock', async ({ page }) => {
  let fail = true
  await page.route('**/api/rooms', (route) =>
    route.fulfill(fail ? { status: 503, json: {} } : { json: [] }),
  )
  await page.goto('http://127.0.0.1:4174/rooms')
  await expect(page.getByText('Chưa tải được dữ liệu')).toBeVisible()
  await expect(page.locator('.room-card')).toHaveCount(0)
  fail = false
  await page.getByRole('button', { name: 'Thử lại' }).click()
  await expect(page.getByText('Chưa có phòng phù hợp.')).toBeVisible()
})
