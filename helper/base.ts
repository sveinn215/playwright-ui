import  {test as base}  from "@playwright/test"
import { SearchPage } from "../pom/searchPage"
import { RegisterPage } from "../pom/registerPage"
import { LoginPage } from "../pom/loginPage"

type BookStoreFixtures = {
    searchPage : SearchPage
    registerPage : RegisterPage
    loginPage : LoginPage
}

export const bookStoreTest = base.extend<BookStoreFixtures>({
    searchPage : async ({ page }, use) => {
        await use(new SearchPage(page))
    },
    registerPage : async ({ page }, use) => {
        await use(new RegisterPage(page))
    },
    loginPage : async ({ page }, use) => {
        await use(new LoginPage(page))
    }
})

export { expect } from "@playwright/test"