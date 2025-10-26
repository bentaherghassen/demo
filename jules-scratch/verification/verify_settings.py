from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5173/register")

    # Register
    timestamp = int(time.time())
    page.get_by_label("Username").fill(f"testuser{timestamp}")
    page.get_by_label("Email").fill(f"test{timestamp}@example.com")
    page.get_by_label("Password").fill("Password123!")
    page.get_by_label("First Name").fill("Test")
    page.get_by_label("Last Name").fill("User")
    page.get_by_label("Gender").select_option("male")
    page.get_by_label("Phone Number").fill("1234567890")
    with page.expect_response("**/api/auth/register") as response_info:
        page.get_by_role("button", name="Register").click()
    response = response_info.value
    token = response.json()["token"]
    page.evaluate(f"localStorage.setItem('token', '{token}')")

    page.goto("http://localhost:5173/settings")
    page.screenshot(path="jules-scratch/verification/settings-profile.png")

    # Edit Addresses Tab
    page.get_by_role("tab", name="Edit Addresses").click()
    page.screenshot(path="jules-scratch/verification/settings-addresses.png")

    # Change Authentication Tab
    page.get_by_role("tab", name="Change Authentication").click()
    page.screenshot(path="jules-scratch/verification/settings-auth.png")

    # Danger Zone Tab
    page.get_by_role("tab", name="Danger Zone").click()
    page.screenshot(path="jules-scratch/verification/settings-danger.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
