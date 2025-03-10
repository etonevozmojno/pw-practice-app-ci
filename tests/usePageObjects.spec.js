import { expect, test } from '@playwright/test';
import {PageManager} from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'
import { argosScreenshot } from "@argos-ci/playwright";

test.beforeEach(async ({page}) => {
    await page.goto('/')
})

test('navigate to form page @smoke', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormUsingCredentialsAndSelectOption(randomEmail, "111111", "Option 2")
    await page.screenshot({path: 'screenshots/formsLayoutsPage.png'})
    const buffer = await page.screenshot()
    console.log(buffer.toString('base64'))
    await pm.onFormLayoutsPage().submitInlineFormUsingCredentialsAndCheckbox(randomFullName, randomEmail, true)
    await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'})
    await pm.navigateTo().datePickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(5)
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(3, 8)
})

test.only('testing with argos', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await argosScreenshot(page, "form layouts page");
    await pm.navigateTo().datepickerPage()
    await argosScreenshot(page, "datepicker page");
})