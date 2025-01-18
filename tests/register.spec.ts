import  { bookStoreTest }  from "../helper/base.ts"

const fillingData = {
    firstName: 'imam',
    lastName: 'isfahani',
    userName: 'automation',
    password: 'Testing12345$'
}

const wrongFormatPassword = {
    noNumerical: 'abcdefg#',
    noAlphabetical: '1234567&',
    noSpecialCharacter: 'abcd1234',
    lessThanEight: 'abc1234#',
    twoSpecialCharacter: 'abc1234#$',
    withSpace: 'abcd 123$'
}

bookStoreTest.beforeEach(async ({registerPage})=>{
    await registerPage.openRegistrationPage()
  });

bookStoreTest.describe(`register test`,() => {
    bookStoreTest(`user should be able to register`,async ({registerPage}) => {
        await registerPage.fillRegistrationForm(fillingData)
        await registerPage.handleCaptcha()
        await registerPage.registerButton.click()
        await registerPage.assertSucceedRegister()
    })

    Object.keys(fillingData).forEach(key =>{
        bookStoreTest(`user should be failed to register when fill ${key} with null`,async ({registerPage}) => {
            var form = fillingData
            form[key] = ''
            await registerPage.fillRegistrationForm(form)
            await registerPage.registerButton.click()
            await registerPage.assertEmptyField(form)
        })
    })

    bookStoreTest(`user should be failed to register when not verify the captcha`,async ({registerPage}) => {
        await registerPage.fillRegistrationForm(fillingData)
        await registerPage.registerButton.click()
        await registerPage.assertFailedCaptchaUnverified()
    })

    Object.keys(wrongFormatPassword).forEach(key =>{
        bookStoreTest(`user should be failed to register when fill password with ${key}`,async ({registerPage}) => {
            var form = fillingData
            form.password = wrongFormatPassword[key]
            await registerPage.fillRegistrationForm(form)
            await registerPage.registerButton.click()
            await registerPage.assertFailedWrongFormat()
        })
    })

    bookStoreTest(`user should be able to navigate to login page`,async ({ registerPage, loginPage}) => {
        await registerPage.loginButton.click()
        await loginPage.loginLabel.isVisible()
    })
})