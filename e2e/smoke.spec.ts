import { expect, test } from '@playwright/test'

test('timeline loads and opens an entry', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Adam Ord' })).toBeVisible()
  await page.getByRole('button', { name: /Sample Co/ }).first().click()
  await expect(
    page.getByRole('heading', { name: 'Placeholder Senior Role' })
  ).toBeVisible()
  await expect(page).toHaveURL(/#sample-co/)
})

test('unknown hash falls back to the about state', async ({ page }) => {
  await page.goto('/#does-not-exist')
  await expect(page.getByText('pick a point on the timeline')).toBeVisible()
})

test('resume page renders', async ({ page }) => {
  await page.goto('/resume')
  await expect(page.getByRole('heading', { name: 'Adam Ord' })).toBeVisible()
  await expect(page.getByText('Experience')).toBeVisible()
})
