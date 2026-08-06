import { expect, test } from '@playwright/test'

test('timeline loads and opens an entry', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Adam Ord' })).toBeVisible()
  await page.getByRole('button', { name: /Redo/ }).first().click()
  await expect(page.getByRole('heading', { name: 'Account Executive Intern' })).toBeVisible()
  await expect(page).toHaveURL(/#redo/)
})

test('education chip opens the BYU detail', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Brigham Young University/ }).first().click()
  await expect(page.getByRole('heading', { name: 'Brigham Young University' })).toBeVisible()
  await expect(
    page.getByRole('article').getByText('Applied and Computational Mathematics')
  ).toBeVisible()
})

test('unknown hash falls back to the about state', async ({ page }) => {
  await page.goto('/#does-not-exist')
  await expect(page.getByText('pick a point on the timeline')).toBeVisible()
})

test('back button and clear control restore the about state', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Redo/ }).first().click()
  await expect(page).toHaveURL(/#redo/)
  await page.goBack()
  await expect(page.getByText('pick a point on the timeline')).toBeVisible()
  await page.getByRole('button', { name: /NEXU/ }).first().click()
  await page.getByRole('button', { name: 'clear selection' }).click()
  await expect(page.getByText('pick a point on the timeline')).toBeVisible()
})

test('command palette jumps to an entry', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Control+k')
  await page.getByPlaceholder('jump to…').fill('skep')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Volunteer Associate' })).toBeVisible()
  await expect(page).toHaveURL(/#skep/)
})

test('resume page renders with education', async ({ page }) => {
  await page.goto('/resume')
  await expect(page.getByRole('heading', { name: 'Adam Ord' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible()
  await expect(page.getByText('Levinthal Capital')).toBeVisible()
})
