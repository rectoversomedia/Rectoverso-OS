/**
 * Rectoverso OS - Authentication Tests
 * E2E tests for login flow
 */

import { test, expect } from '@playwright/test'

// ============================================
// Test Data
// ============================================

const TEST_USERS = {
  admin: {
    email: 'admin@rectoverso.com',
    password: 'Admin123!@#',
  },
  manager: {
    email: 'manager@rectoverso.com',
    password: 'Manager123!@#',
  },
}

// ============================================
// Login Tests
// ============================================

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login form correctly', async ({ page }) => {
    // Check form elements
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()

    // Check for "forgot password" link
    await expect(page.getByText(/forgot password/i)).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('should show error for invalid email format', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByText(/invalid email address/i)).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('wrong@email.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByText(/invalid email or password/i)).toBeVisible()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    // Use test credentials
    await page.getByLabel(/email/i).fill(TEST_USERS.admin.email)
    await page.getByLabel(/password/i).fill(TEST_USERS.admin.password)
    await page.getByRole('button', { name: /sign in/i }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')

    // Should show user menu
    await expect(page.getByTestId('user-menu')).toBeVisible()
  })

  test('should remember me functionality', async ({ page }) => {
    await page.getByLabel(/email/i).fill(TEST_USERS.admin.email)
    await page.getByLabel(/password/i).fill(TEST_USERS.admin.password)
    await page.getByLabel(/remember me/i).check()
    await page.getByRole('button', { name: /sign in/i }).click()

    // Should set persistent cookie
    const cookies = await page.context().cookies()
    expect(cookies.some(c => c.name === 'remember_me')).toBeTruthy()
  })
})

// ============================================
// Forgot Password Tests
// ============================================

test.describe('Forgot Password', () => {
  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/login')
    await page.getByText(/forgot password/i).click()

    await expect(page).toHaveURL('/forgot-password')
    await expect(page.getByRole('heading', { name: /reset password/i })).toBeVisible()
  })

  test('should send reset email for valid email', async ({ page }) => {
    await page.goto('/forgot-password')

    await page.getByLabel(/email/i).fill(TEST_USERS.admin.email)
    await page.getByRole('button', { name: /send reset link/i }).click()

    await expect(page.getByText(/check your email/i)).toBeVisible()
  })

  test('should show error for non-existent email', async ({ page }) => {
    await page.goto('/forgot-password')

    await page.getByLabel(/email/i).fill('nonexistent@email.com')
    await page.getByRole('button', { name: /send reset link/i }).click()

    await expect(page.getByText(/email not found/i)).toBeVisible()
  })
})

// ============================================
// Logout Tests
// ============================================

test.describe('Logout', () => {
  test.use({ storageState: '.auth/user.json' })

  test('should logout successfully', async ({ page }) => {
    await page.goto('/dashboard')

    // Click user menu
    await page.getByTestId('user-menu').click()

    // Click logout
    await page.getByText(/logout/i).click()

    // Should redirect to login
    await expect(page).toHaveURL('/login')

    // Should not have auth cookie
    const cookies = await page.context().cookies()
    expect(cookies.some(c => c.name === 'auth_token')).toBeFalsy()
  })
})
