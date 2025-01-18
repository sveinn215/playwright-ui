import { bookStoreTest } from "../helper/base";

const fillingData = {
    userName: `admin`,
    password: `Admin1234#`
}

const failedLogin = {
    wrongPassword: {
        userName: `admin`,
        password: `admin1234#`
    },
    unregisteredUsername: {
        userName: `automation`,
        password: `Admin1234#`
    }
}

bookStoreTest.beforeEach(async ({loginPage})=>{
    await loginPage.openLoginPage()
});

bookStoreTest.describe(`login test`,() => {
    bookStoreTest(`user should be able to login`,async ({loginPage}) => {
        await loginPage.fillLoginForm(fillingData)
        await loginPage.loginButton.click()
        await loginPage.assertSucceedLogin(fillingData.userName)
    })

    Object.keys(fillingData).forEach(key =>{
        bookStoreTest(`user should be failed to login when fill ${key} with null`,async ({loginPage,registerPage}) => {
            var form = fillingData;
            form[key] = ''
            await loginPage.fillLoginForm(form)
            await loginPage.loginButton.click()
            await registerPage.assertEmptyField(form)
        })
    })

    Object.keys(failedLogin).forEach(key => {
        bookStoreTest(`user should be failed to login when login with ${key}`,async ({loginPage}) => {
            await loginPage.fillLoginForm(failedLogin[key])
            await loginPage.loginButton.click()
            await loginPage.assertLoginError()
        })
    })

    bookStoreTest(`user should be able to navigate to registration page`,async ({loginPage, registerPage}) => {
        await loginPage.registerButton.click()
        await registerPage.registerLabel.isVisible()
    })
})