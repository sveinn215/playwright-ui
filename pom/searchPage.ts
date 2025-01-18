import { expect, Locator, Page } from "@playwright/test"

export class SearchPage {
    public url = `https://demoqa.com/books`
    readonly page: Page
    readonly searchTextBox: Locator
    readonly emptyRowPopup: Locator
    readonly titleColumn: Locator
    readonly imageColumn: Locator
    readonly authorColumn: Locator
    readonly publisherColumn: Locator
    readonly loginPage: Locator
    readonly previousButton: Locator
    readonly nextButton: Locator
    readonly rowsPerPageSelect : Locator
    readonly tableRows: Locator
    readonly pageNumberText : Locator
    readonly loginButton :  Locator

    constructor(page : Page){
        this.page = page
        this.searchTextBox = this.page.locator(`//input[@id="searchBox"]`)
        this.emptyRowPopup = this.page.locator(`//div[@class="rt-noData"]`)
        this.titleColumn = this.page.locator(`//div[@class="action-buttons"]//span//a`)
        this.imageColumn = this.page.locator(`//div[@role="gridcell"]//img`)
        this.authorColumn = this.page.locator(`//div[@role="gridcell" and not(.//span)][2]`)
        this.publisherColumn = this.page.locator(`//div[@role="gridcell" and not(.//span)][3]`)
        this.previousButton = this.page.getByRole("button").getByText("Previous")
        this.nextButton = this.page.getByRole("button").getByText("Next")
        this.rowsPerPageSelect = this.page.locator(`//select[@aria-label="rows per page"]`)
        this.tableRows = this.page.getByRole("rowgroup")
        this.pageNumberText = this.page.locator(`//input[@aria-label="jump to page"]`)
        this.loginButton =  this.page.getByRole(`button`).getByText(`Login`)
    }

    public async openSearchPage(){
        await this.page.goto(this.url,{waitUntil:'domcontentloaded'})
    }

    public async searchBook(keyword: string){
        await this.searchTextBox.fill(keyword)
    }

    public async assertBooksAreContainsKeyword(keyword: string, field: string){
        var bookLists:string[] = []
        if(field == "TITLE"){
            bookLists = await this.titleColumn.allInnerTexts()
        }else if(field == "AUTHOR"){
            bookLists = await this.authorColumn.allInnerTexts()
        }else if(field = "PUBLISHER"){
            bookLists = await this.publisherColumn.allInnerTexts()
        }else if(field = "NOTFOUND"){
            expect(this.emptyRowPopup.isVisible()).toEqual(false)
            return
        }

        bookLists.forEach(book => {
            expect(book.toLowerCase()).toContain(keyword.toLowerCase())
        });
    }

    public async selectRowOfPage(page: number){
        await this.rowsPerPageSelect.selectOption(`${page}`)
    }

    public async assertNumberOfRowList(page: number){
        expect(await this.tableRows.count()).toBeLessThanOrEqual(page)
    }

    public async navigateToPage(page: string){
        if(page == `PREVIOUS`){
            await this.previousButton.click()
        }else if(page == `NEXT`){
            await this.nextButton.click()
        }else{
            await this.pageNumberText.clear()
            await this.pageNumberText.fill(page)
            await this.page.keyboard.down(`Enter`)
        }
    }

    public async assertPageChanged(previousData: string[],currentData: string[]){
        expect(previousData).not.toContainEqual(currentData)
    }
}
