import { expect, test } from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/')
})

test.describe('Form layouts page', () => {
    test.describe.configure({retries: 0})
    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}, testInfo) => {
        if (testInfo.retry) {
            //do something
        }
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test@test.com') //simulates slower typing

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion - toHaveValue is used with input element
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com1')
    })

    test.only('radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

        await usingTheGridForm.getByLabel('Option 1').check({force: true}) //wont work without "force" for hidden elements
        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})

        //validate selection success
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
        await expect(usingTheGridForm).toHaveScreenshot({maxDiffPixels: 150}) //baseline screenshot
        // expect(radioStatus).toBeTruthy()
        // await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

        // await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })
})


test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()   

    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    //check method checks the status of the checkbox - if the checkbox is already checked, it wont uncheck it
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    //select unselect all checkboxes
    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()) {
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy()
    }
})

test('lists and dropdowns', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') //when the list has UL tag
    page.getByRole('listitem') //when the list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option') //all list items

    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    await dropDownMenu.click()
    const colors = {
       "Light" : "rgb(255, 255, 255)",
       "Dark" : "rgb(34, 43, 69)",
       "Cosmic" : "rgb(50, 50, 89)",
       "Corporate" : "rgb(255, 255, 255)"
    }

    for(const color in colors) {
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate") {
            await dropDownMenu.click()
        }
    }
})

//how to locate a tooltip?
//locate to sources tab, hover to show the tooltip and click CMD + backslash to freeze the browser
//and then go back to elements and find the needed tooltip
test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()
    
    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})

    await toolTipCard.getByRole('button', {name: "Top"}).hover()

    page.getByRole('tooltip') // if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual("This is a tooltip")

})


//1st type - dialogs that are part of the DOM
//2nd type - system alert from browser
test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart table').click()

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    
    //playwright can identify system dialog boxes and automatically cancels them by default
    
    //create a listener
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
    
    

})

test('web tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart table').click()
    /*

    // get the row by any text in this row

    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()

    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    // get the row based on the value in the specific column

    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')*/

    //test filter of the table

    const ages = ["20", "30", "40", "200"]

    for(let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500) 

        const ageRows = page.locator('tbody tr')

        for(let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()

            if(age == "200") {
                expect(await page.getByRole('table').textContent()).toContain("No data found")
            } else {
                expect(cellValue).toEqual(age)
            }
           
        }
    }

})

test('datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 200)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`

    while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()

    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async({page}) => {
    //update attribute - coordinates
    //const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    //await tempGauge.evaluate(node => {
      //  node.setAttribute('cx', '232.630')
       // node.setAttribute('cy', '232.630')
   // }) //gauge moved down, but the value didn't update, event was not triggered
    //await tempGauge.click()

    //simulate mouse movement
    //define the area to move our mouse
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox() //create coordinates around the element, top coords - (0,0)

    const x = box.x + box.width / 2
    const y = box.y + box.height / 2 //starting coordinates in the center

    await page.mouse.move(x, y)
    await page.mouse.down() //left key
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')
})

