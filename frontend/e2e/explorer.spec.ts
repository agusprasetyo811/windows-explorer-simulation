import { test, expect } from '@playwright/test';

test.describe('Windows Explorer App', () => {
  test('should load the app and display the main layout', async ({ page }) => {
    // Navigate to the app (running locally on port 80/localhost)
    await page.goto('http://localhost');

    // Verify the title
    await expect(page).toHaveTitle(/Windows Explorer/);

    // Verify main components are visible
    await expect(page.locator('.explorer-toolbar')).toBeVisible();
    await expect(page.locator('.panel-left')).toBeVisible();
    await expect(page.locator('.panel-right')).toBeVisible();
  });

  test('should display folder tree and allow selection', async ({ page }) => {
    await page.goto('http://localhost');

    // Wait for folders to load
    const treeFolder = page.locator('.tree-node').first();
    await expect(treeFolder).toBeVisible({ timeout: 5000 });

    // Click on a folder
    await treeFolder.locator('.tree-row').click();

    // Verify that right panel shows the folder contents
    const contentList = page.locator('.content-list');
    await expect(contentList).toBeVisible();
  });

  test('should perform a search and show results', async ({ page }) => {
    await page.goto('http://localhost');

    // Type in the search bar
    const searchInput = page.locator('.search-input');
    await searchInput.fill('a');
    
    // Click search button
    const searchButton = page.locator('.search-button');
    await searchButton.click();

    // The content list should show search results
    const contentList = page.locator('.content-list');
    await expect(contentList).toBeVisible();
    
    // There should be at least one content item
    const contentItem = page.locator('.content-item').first();
    await expect(contentItem).toBeVisible();
  });
});
