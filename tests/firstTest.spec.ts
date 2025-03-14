import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('forms').click()
    await page.getByText('Form Layouts').click()
})

test('locator syntax rules', async ({page}) => {
    // By tag name
    await page.locator('input').first().click()

    // By id
    await page.locator('#inputEmail1').click()

    // By class
    await page.locator('.shape-rectangle').click()

    // By attribute
    await page.locator('[placeholder="Email"]').click()

    // By full class value
    await page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]').click()

    // Combining locators
    await page.locator('input[placeholder="Email"][nbinput]').click()

    // XPath (NOT RECOMMENDED)
    await page.locator('//*[@id="inputEmail1"]').click()

    // Partial text match
    await page.locator(':text("Using")').click()

    // Exact text match
    await page.locator(':text-is("Using the Grid")').click()
})

test('User-facing locators', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).first().click()
    await page.getByRole('button', { name: 'Sign in' }).first().click()
    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Using the Grid').click()
    await page.getByTestId('SignIn').click()
})

test('locating child elements', async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click()

    // Avoid using nth selectors unless necessar
    await page.locator('nb-card').nth(3).getByRole('button').click()
})


test('locating parent elements', async ({ page }) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    //not recommended
    await page.locator(':text-is("Using the grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('Reusing the locators', async ({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

test('extracting values', async({page}) => {
    //single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain('Option 1')

    //input field value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect (emailValue).toEqual("test@test.com")

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect (placeholderValue).toEqual('Email')
})

test('assertions', async({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    //general assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //locator assertion
    await expect(basicFormButton).toHaveText('Submit')

    //soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit')
    //text will continue, event if soft assert fails
    await basicFormButton.click()
})
