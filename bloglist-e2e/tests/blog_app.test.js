
import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

    await page.locator('input[type="text"]').fill('mluukkai')
    await page.locator('input[type="password"]').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('Matti Luukkainen')).toBeVisible()
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

    await page.locator('input[type="text"]').fill('mluukkai')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText(/wrong username or password/i)).toBeVisible()
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()

      await page.locator('input[type="text"]').fill('mluukkai')
      await page.locator('input[type="password"]').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'create new blog' }).click()

      await page.locator('input[type="text"]').nth(0).fill('Playwright testing')
      await page.locator('input[type="text"]').nth(1).fill('Test Author')
      await page.locator('input[type="text"]').nth(2).fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByRole('link', { name: /Playwright testing/ })
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('link', { name: 'create new blog' }).click()

      await page.locator('input[type="text"]').nth(0).fill('Blog to like')
      await page.locator('input[type="text"]').nth(1).fill('Test Author')
      await page.locator('input[type="text"]').nth(2).fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: /Blog to like/ }).click()

      const blog = page.getByTestId('blog')

      await expect(blog.getByText(/likes 0/)).toBeVisible()
      await blog.getByRole('button', { name: 'like' }).click()
      await expect(blog.getByText(/likes 1/)).toBeVisible()
    })

    test('a blog can be deleted by its creator', async ({ page }) => {
      await page.getByRole('link', { name: 'create new blog' }).click()

      await page.locator('input[type="text"]').nth(0).fill('Blog to delete')
      await page.locator('input[type="text"]').nth(1).fill('Test Author')
      await page.locator('input[type="text"]').nth(2).fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: /Blog to delete/ }).click()

      page.on('dialog', dialog => dialog.accept())

      const blog = page.getByTestId('blog')
      await blog.getByRole('button', { name: 'remove' }).click()

      await expect(page).toHaveURL('http://localhost:5173/')
      await expect(
        page.getByRole('link', { name: /Blog to delete/ })
      ).toHaveCount(0)
    })
  })
})
