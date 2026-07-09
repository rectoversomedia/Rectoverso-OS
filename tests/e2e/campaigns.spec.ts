/**
 * Rectoverso OS - Campaign Flow Tests
 * E2E tests for campaign management
 */

import { test, expect } from '@playwright/test'

// ============================================
// Test Data
// ============================================

const TEST_CAMPAIGN = {
  name: 'Test Campaign ' + Date.now(),
  type: 'lead_generation',
  client: 'Tunaiku',
  budget: 50000000,
}

// ============================================
// Campaign List Tests
// ============================================

test.describe('Campaign List', () => {
  test.use({ storageState: '.auth/user.json' })

  test.beforeEach(async ({ page }) => {
    await page.goto('/campaigns')
  })

  test('should display campaign list page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /campaigns/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /new campaign/i })).toBeVisible()
  })

  test('should filter campaigns by status', async ({ page }) => {
    // Click filter button
    await page.getByRole('button', { name: /filter/i }).click()

    // Select status filter
    await page.getByText(/running/i).click()

    // Should show filtered results
    await expect(page.getByTestId('campaign-list')).toBeVisible()
  })

  test('should search campaigns', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search campaigns/i)
    await searchInput.fill('Test')

    // Should debounce and search
    await page.waitForTimeout(500)

    // Should show search results
    await expect(page.getByTestId('campaign-list')).toBeVisible()
  })

  test('should paginate campaigns', async ({ page }) => {
    // Go to page 2
    await page.getByRole('button', { name: /next/i }).click()

    await expect(page.getByText(/page 2/i)).toBeVisible()
  })
})

// ============================================
// Create Campaign Tests
// ============================================

test.describe('Create Campaign', () => {
  test.use({ storageState: '.auth/user.json' })

  test('should navigate to new campaign form', async ({ page }) => {
    await page.goto('/campaigns')
    await page.getByRole('button', { name: /new campaign/i }).click()

    await expect(page).toHaveURL('/campaigns/new')
    await expect(page.getByRole('heading', { name: /new campaign/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/campaigns/new')

    await page.getByRole('button', { name: /create campaign/i }).click()

    await expect(page.getByText(/name is required/i)).toBeVisible()
    await expect(page.getByText(/client is required/i)).toBeVisible()
    await expect(page.getByText(/campaign type is required/i)).toBeVisible()
  })

  test('should create campaign successfully', async ({ page }) => {
    await page.goto('/campaigns/new')

    // Fill form
    await page.getByLabel(/campaign name/i).fill(TEST_CAMPAIGN.name)
    await page.getByLabel(/select client/i).click()
    await page.getByText(TEST_CAMPAIGN.client).click()
    await page.getByLabel(/campaign type/i).click()
    await page.getByText(/lead generation/i).click()
    await page.getByLabel(/budget/i).fill(String(TEST_CAMPAIGN.budget))

    // Submit
    await page.getByRole('button', { name: /create campaign/i }).click()

    // Should redirect to campaign detail
    await expect(page).toHaveURL(/\/campaigns\/[a-z0-9-]+/i)
    await expect(page.getByText(TEST_CAMPAIGN.name)).toBeVisible()
  })
})

// ============================================
// Campaign Detail Tests
// ============================================

test.describe('Campaign Detail', () => {
  test.use({ storageState: '.auth/user.json' })

  test('should display campaign details', async ({ page }) => {
    // Navigate to first campaign
    await page.goto('/campaigns')

    // Click first campaign
    await page.getByTestId('campaign-card').first().click()

    // Should show tabs
    await expect(page.getByRole('tab', { name: /overview/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /checklist/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /tasks/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /publishers/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /performance/i })).toBeVisible()
  })

  test('should switch tabs', async ({ page }) => {
    await page.goto('/campaigns')
    await page.getByTestId('campaign-card').first().click()

    // Click checklist tab
    await page.getByRole('tab', { name: /checklist/i }).click()
    await expect(page.getByTestId('checklist-content')).toBeVisible()

    // Click tasks tab
    await page.getByRole('tab', { name: /tasks/i }).click()
    await expect(page.getByTestId('tasks-content')).toBeVisible()
  })

  test('should update campaign status', async ({ page }) => {
    await page.goto('/campaigns')
    await page.getByTestId('campaign-card').first().click()

    // Open status dropdown
    await page.getByTestId('status-dropdown').click()
    await page.getByText(/running/i).click()

    // Should show success toast
    await expect(page.getByText(/status updated/i)).toBeVisible()
  })

  test('should edit campaign', async ({ page }) => {
    await page.goto('/campaigns')
    await page.getByTestId('campaign-card').first().click()

    // Click edit button
    await page.getByRole('button', { name: /edit/i }).click()

    // Should show edit modal
    await expect(page.getByRole('dialog')).toBeVisible()

    // Close modal
    await page.keyboard.press('Escape')
  })
})

// ============================================
// Campaign Checklist Tests
// ============================================

test.describe('Campaign Checklist', () => {
  test.use({ storageState: '.auth/user.json' })

  test('should display checklist items', async ({ page }) => {
    await page.goto('/campaigns')
    await page.getByTestId('campaign-card').first().click()
    await page.getByRole('tab', { name: /checklist/i }).click()

    // Should show phases
    await expect(page.getByText(/preparation/i)).toBeVisible()
    await expect(page.getByText(/setup/i)).toBeVisible()
    await expect(page.getByText(/execution/i)).toBeVisible()
  })

  test('should toggle checklist item', async ({ page }) => {
    await page.goto('/campaigns')
    await page.getByTestId('campaign-card').first().click()
    await page.getByRole('tab', { name: /checklist/i }).click()

    // Click first unchecked item
    const uncheckedItem = page.getByTestId('checklist-item').filter({ has: page.getByRole('checkbox', { checked: false }) }).first()
    await uncheckedItem.click()

    // Should show loading state
    await expect(page.getByTestId('loading')).toBeVisible()

    // Should be checked now
    await expect(uncheckedItem.getByRole('checkbox')).toBeChecked()
  })
})
