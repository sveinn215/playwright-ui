import { expect, Locator, Page } from "@playwright/test"

export class RegisterPage{
    public url = `https://demoqa.com/register`
    readonly page : Page
    readonly firstNameText : Locator
    readonly lastNameText : Locator
    readonly userNameText : Locator
    readonly passwordText : Locator
    readonly registerButton : Locator
    readonly captchaCheck: Locator
    readonly formatError : Locator
    readonly captchaError : Locator
    readonly registerLabel : Locator
    readonly loginButton : Locator

    constructor(page: Page){
        this.page = page
        this.firstNameText = this.page.getByPlaceholder(`First Name`)
        this.lastNameText =  this.page.getByPlaceholder(`Last Name`)
        this.userNameText = this.page.getByPlaceholder(`UserName`)
        this.passwordText = this.page.getByPlaceholder(`Password`)
        this.registerButton = this.page.getByRole(`button`).getByText(`Register`)
        this.captchaCheck = this.page.locator(`iframe[title="reCAPTCHA"]`).contentFrame().getByLabel(`I\'m not a robot`)
        this.formatError = this.page.getByText(`Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.`)
        this.captchaError = this.page.getByText(`Please verify reCaptcha to register!`)
        this.registerLabel =  this.page.getByText(`Register to Book Store`)
        this.loginButton = this.page.getByRole(`button`).getByText(`Back to Login`)
    }

    public async openRegistrationPage(){
        this.page.goto(this.url, {waitUntil:'domcontentloaded'})
        this.page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        })
    }

    public async fillRegistrationForm(data: object){
        await this.firstNameText.fill(data[`firstName`])
        await this.lastNameText.fill(data[`lastName`])
        await this.userNameText.fill(data[`userName`])
        await this.passwordText.fill(data[`password`])
    }

    public async assertSucceedRegister(){
        this.page.on(`dialog`, async dialog => {
            expect(dialog.message()).toEqual(`User Register Successfully.`)
            await dialog.accept()
        })
    }

    public async handleCaptcha(){
        //not finished yet, need to find an free approach to do it. don't have paid account to pay account resolver
        await this.captchaCheck.click()
        await this.page.waitForTimeout(3000)
    }

    public async assertEmptyField(data: object){
        await this.page.waitForTimeout(1000)
        var filter = Object.keys(data).find(key =>
            data[key] === '');
        
        if(filter != 'userName'){
            filter = filter?.toLowerCase()
        }

        await this.page.locator(`//input[@id='${filter}' and contains(@class,'invalid')]`).isVisible()
    }

    public async assertFailedWrongFormat(){
        await this.formatError.isVisible()
    }

    public async assertFailedCaptchaUnverified(){
        await this.captchaError.isVisible()
    }
    
}