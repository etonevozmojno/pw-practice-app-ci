import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)
})

test('auto waiting', async ({page}) => {
    const successButton = page.locator('.bg-success')
    await successButton.click()

    //const text = await successButton.textContent()

    //allTextContents doesn't wait properly
    await successButton.waitFor({state: "attached"})
    const text = await successButton.allTextContents()

    expect(text).toEqual('Data loaded with AJAX get request.')

    //timeout override
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test.skip('alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    //___ wait for element
    await page.waitForSelector('.bg-success')

    //___ wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //___ wait for all network calls to be completed (NOT RECOMMENDED)
    //if some api call is stuck, your test will stuck
    await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async ({page}) => {
    //test.setTimeout(10000)
    //test.slow()
    const successButton = page.locator('.bg-success')
    await successButton.click({timeout: 16000}) 
})
