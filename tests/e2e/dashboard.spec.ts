import { test, expect } from "@playwright/test";

const DASHBOARD = "/farmer/dashboard";

// ─── Initial load ─────────────────────────────────────────────────────────────

test.describe("Initial load", () => {
  test("redirects from / to /farmer/dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/farmer\/dashboard/);
  });

  test("renders the AgriConnect header", async ({ page }) => {
    await page.goto(DASHBOARD);
    await expect(page.getByText("AgriConnect")).toBeVisible();
  });

  test("shows 3 pending cards on initial load", async ({ page }) => {
    await page.goto(DASHBOARD);
    const acceptButtons = page.getByRole("button", { name: "Accept Request" });
    await expect(acceptButtons).toHaveCount(3);
  });

  test("shows 2 accepted cards on initial load", async ({ page }) => {
    await page.goto(DASHBOARD);
    const acceptedBadges = page.locator("span").filter({ hasText: /^Accepted$/ });
    await expect(acceptedBadges).toHaveCount(2);
  });

  test("displays Pending and Accepted column headers", async ({ page }) => {
    await page.goto(DASHBOARD);
    await expect(page.getByRole("heading", { name: "Pending" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Accepted" })).toBeVisible();
  });

  test("shows 5 total requests on initial load", async ({ page }) => {
    await page.goto(DASHBOARD);
    const pending = await page.getByRole("button", { name: "Accept Request" }).count();
    const accepted = await page.locator("span").filter({ hasText: /^Accepted$/ }).count();
    expect(pending + accepted).toBe(5);
  });
});

// ─── Accept request (card movement) ──────────────────────────────────────────

test.describe("State transitions — accept request", () => {
  test("clicking Accept removes card from pending column", async ({ page }) => {
    await page.goto(DASHBOARD);
    const buttons = page.getByRole("button", { name: "Accept Request" });
    const initialCount = await buttons.count();
    await buttons.first().click();
    await expect(buttons).toHaveCount(initialCount - 1);
  });

  test("clicking Accept adds a card to accepted column", async ({ page }) => {
    await page.goto(DASHBOARD);
    const badges = page.locator("span").filter({ hasText: /^Accepted$/ });
    const initialAccepted = await badges.count();
    await page.getByRole("button", { name: "Accept Request" }).first().click();
    await expect(badges).toHaveCount(initialAccepted + 1);
  });

  test("accepted card shows 'Accepted' status badge", async ({ page }) => {
    await page.goto(DASHBOARD);
    await page.getByRole("button", { name: "Accept Request" }).first().click();
    const acceptedBadges = page.getByText("Accepted").first();
    await expect(acceptedBadges).toBeVisible();
  });

  test("stats update correctly after accepting a request", async ({ page }) => {
    await page.goto(DASHBOARD);
    await page.getByRole("button", { name: "Accept Request" }).first().click();
    // Pending count chip should show 2 (was 3)
    const pendingChip = page.getByText("2").first();
    await expect(pendingChip).toBeVisible();
  });

  test("accepting all pending cards shows empty state in pending column", async ({
    page,
  }) => {
    await page.goto(DASHBOARD);
    const buttons = page.getByRole("button", { name: "Accept Request" });
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await page.getByRole("button", { name: "Accept Request" }).first().click();
    }
    await expect(page.getByText("No pending requests")).toBeVisible();
  });
});

// ─── Automatic simulation (simulated WebSocket / broker push) ─────────────────

test.describe("Real-time simulation — broker push events", () => {
  test("new request appears in pending column after 5 seconds", async ({
    page,
  }) => {
    await page.goto(DASHBOARD);
    const initialCount = await page
      .getByRole("button", { name: "Accept Request" })
      .count();

    // Wait 6s to ensure the 5s interval has fired at least once
    await page.waitForTimeout(6000);

    const newCount = await page
      .getByRole("button", { name: "Accept Request" })
      .count();
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test("toast notification appears when new request arrives", async ({
    page,
  }) => {
    await page.goto(DASHBOARD);
    // The toast appears within 5s of the interval firing
    const toast = page.getByText(/New request from .+ received/);
    await expect(toast).toBeVisible({ timeout: 7000 });
  });

  test("toast notification disappears after 3 seconds", async ({ page }) => {
    await page.goto(DASHBOARD);
    const toast = page.getByText(/New request from .+ received/);
    await expect(toast).toBeVisible({ timeout: 7000 });
    // Toast auto-hides after 3 more seconds
    await expect(toast).not.toBeVisible({ timeout: 5000 });
  });

  /**
   * Simulates a WebSocket push by injecting state directly via page.evaluate().
   * In production this would be replaced by a mocked WebSocket message.
   *
   * NOTE: This test requires React DevTools or a test helper that exposes
   * a global dispatch function. Below is the pattern to use once that is wired.
   */
  test.skip("WebSocket push: injecting a request via page.evaluate()", async ({
    page,
  }) => {
    await page.goto(DASHBOARD);

    // In a real WebSocket setup you would mock the socket server and
    // emit a message from the test:
    //
    //   await page.evaluate(() => {
    //     window.__TEST_WS_INJECT__({
    //       id: "ws-001",
    //       farmerName: "Test WS Farmer",
    //       produce: "Pepper",
    //       quantity: 50,
    //       unit: "kg",
    //       status: "Pending",
    //       timestamp: new Date().toISOString(),
    //     });
    //   });
    //
    //   await expect(page.getByText("Test WS Farmer")).toBeVisible();

    expect(true).toBe(true); // placeholder — remove when WS is implemented
  });
});
