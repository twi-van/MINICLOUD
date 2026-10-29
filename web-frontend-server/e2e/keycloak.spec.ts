import { expect, test } from '@playwright/test'

test('login uses the public client, PKCE and a same-origin return URL', async ({
  page,
  baseURL,
}) => {
  await page.goto('/login?redirect=%2F%2Fexample.invalid%2F')
  await expect(page.locator('input[type="password"]')).toHaveCount(0)
  await page.getByRole('button', { name: 'Đăng nhập qua Keycloak' }).click()
  await expect(page.locator('#username')).toBeVisible()
  const url = new URL(page.url())
  expect(url.searchParams.get('client_id')).toBe('web-frontend')
  expect(url.searchParams.get('code_challenge_method')).toBe('S256')
  expect(Boolean(url.searchParams.get('code_challenge'))).toBe(true)
  expect(url.searchParams.get('redirect_uri')).toBe(new URL('/rooms', baseURL).href)
})

test('real login, callback, reload, token refresh, authenticated API and logout', async ({
  page,
  baseURL,
}) => {
  const username = process.env.AUTH_E2E_USER || 'student_demo'
  const password = process.env.AUTH_E2E_PASSWORD || ''
  expect(Boolean(password), 'Set AUTH_E2E_PASSWORD for a test account in realm minicloud').toBe(
    true,
  )
  const tokens: string[] = []
  let refreshes = 0
  let authenticatedStudentRequest = false
  page.on('request', (request) => {
    if (request.url().includes('/protocol/openid-connect/token')) {
      if (new URLSearchParams(request.postData() || '').get('grant_type') === 'refresh_token')
        refreshes++
    }
    if (request.url().includes('/api/')) {
      const bearer = request.headers().authorization
      if (bearer?.startsWith('Bearer ')) {
        tokens.push(bearer.slice(7))
        if (request.url().endsWith('/api/student')) authenticatedStudentRequest = true
      }
    }
  })
  await page.goto('/login?redirect=%2Frooms%2F1%3FauthTest%3D1')
  await page.getByRole('button', { name: 'Đăng nhập qua Keycloak' }).click()
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('#kc-login').click()
  await expect(page).toHaveURL(new URL('/rooms/1?authTest=1', baseURL).href)
  await expect(page.getByRole('status', { name: /^Tài khoản / })).toBeVisible()
  await expect.poll(() => tokens.length).toBeGreaterThan(0)

  await page.reload()
  await expect(page.getByRole('status', { name: /^Tài khoản / })).toBeVisible()
  await expect(page).toHaveURL(new URL('/rooms/1?authTest=1', baseURL).href)

  // Expire the browser's view of the token without waiting for the server TTL.
  await page.clock.setFixedTime(new Date(Date.now() + 3600000))
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Sinh viên', exact: true })
    .click()
  await expect(page.locator('tbody .ant-table-row').first()).toBeVisible()
  await expect.poll(() => refreshes).toBeGreaterThan(0)
  expect(authenticatedStudentRequest).toBe(true)
  const storage = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))
  expect(tokens.some((token) => storage.includes(token))).toBe(false)

  // The clock jump is only for the refresh assertion, not UI animation timings.
  await page.clock.setFixedTime(new Date())

  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click()
  await expect(page).toHaveURL(new URL('/', baseURL).href)
  await expect(page.getByRole('status', { name: /^Tài khoản / })).toHaveCount(0)
  expect(await page.evaluate(() => sessionStorage.getItem('minihome:keycloak-session'))).toBeNull()
})

test('registration reflects the realm policy instead of creating a mock account', async ({
  page,
}) => {
  await page.goto('/register')
  await expect(
    page.getByText('Tài khoản được cấp bởi quản trị viên.', { exact: false }),
  ).toBeVisible()
  await expect(page.locator('input[type="password"]')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Đăng nhập qua Keycloak' })).toBeVisible()
})

test('mobile users can sign in and sign out from the navigation drawer', async ({
  page,
  baseURL,
}) => {
  const password = process.env.AUTH_E2E_PASSWORD || ''
  expect(Boolean(password), 'Set AUTH_E2E_PASSWORD for the test account').toBe(true)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/login')
  await page.getByRole('button', { name: 'Đăng nhập qua Keycloak' }).click()
  await page.locator('#username').fill(process.env.AUTH_E2E_USER || 'student_demo')
  await page.locator('#password').fill(password)
  await page.locator('#kc-login').click()
  await expect(page.getByRole('status', { name: /^Tài khoản / })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Mở menu' }).click()
  await page.getByRole('button', { name: /Đăng xuất/ }).click()
  await expect(page).toHaveURL(new URL('/', baseURL).href)
  await expect(page.getByRole('status', { name: /^Tài khoản / })).toHaveCount(0)
})
