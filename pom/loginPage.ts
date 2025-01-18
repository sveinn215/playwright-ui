import { expect, Locator, Page } from "@playwright/test"

export class LoginPage{
    public url=`https://demoqa.com/login`
    readonly page: Page
    readonly userNameText : Locator
    readonly passwordText : Locator
    readonly loginButton : Locator
    readonly registerButton : Locator
    readonly loginError : Locator
    readonly userNameLabel : Locator
    readonly loginLabel : Locator

    constructor(page: Page){
        this.page = page
        this.userNameText = this.page.getByPlaceholder(`UserName`)
        this.passwordText = this.page.getByPlaceholder(`Password`)
        this.loginButton =  this.page.getByRole(`button`).getByText(`Login`)
        this.registerButton =  this.page.getByRole(`button`).getByText(`New User`)
        this.userNameLabel =  this.page.locator(`//label[@id="userName-value"]`)
        this.loginError = this.page.getByText(`Invalid username or password!`)
        this.loginLabel =  this.page.getByText(`Login in Book Store`)
    }

    public async openLoginPage(){
        await this.page.goto(this.url, {waitUntil:'domcontentloaded'})
    }

    public async fillLoginForm(data: object){
        await this.userNameText.fill(data[`userName`])
        await this.passwordText.fill(data[`password`])
    }

    public async assertSucceedLogin(userName: string){
        await this.userNameLabel.isVisible()
        expect(await this.userNameLabel.innerText()).toEqual(userName)
    }

    public async assertLoginError(){
        await this.loginError.isVisible()
    }

}