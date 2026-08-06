import { expect, test } from '@playwright/test'

test('timeline loads and opens an entry', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Adam Ord' })).toBeVisible()
  await page.getByRole('button', { name: /Redo/ }).first().click()
  await expect(page.getByRole('heading', { name: 'Account Executive Intern' })).toBeVisible()
  await expect(page).toHaveURL(/#redo/)
})

test('default state shows education and background', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Applied and Computational Math Emphasis (ACME)')).toBeVisible()
  await expect(page.getByText('Eagle Scout')).toBeVisible()
})

test('solo stove card opens its entry', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Solo Stove/ }).first().click()
  await expect(page.getByRole('heading', { name: 'Associate' })).toBeVisible()
  await expect(page.getByText('2020 – 2022 · 3 yrs · Grapevine, TX')).toBeVisible()
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
  await page.getByPlaceholder('jump to…').fill('halverson')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Teaching Assistant' })).toBeVisible()
  await expect(page).toHaveURL(/#halverson-ta/)
})

test('resume page renders with education and additional sections', async ({ page }) => {
  await page.goto('/resume')
  await expect(page.getByRole('heading', { name: 'Adam Ord' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Additional' })).toBeVisible()
  await expect(page.getByText('Solo Stove')).toBeVisible()
})
