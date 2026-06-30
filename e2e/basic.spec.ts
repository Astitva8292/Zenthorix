import { test, expect } from '@playwright/test'

test('IDE loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('text=Zenthorix IDE')).toBeVisible()
})

test('chat interface is accessible', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('text=Type a message')).toBeVisible()
})
