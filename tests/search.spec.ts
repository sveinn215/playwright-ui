import { bookStoreTest } from '../helper/base.ts';

const searchTestCases = {
  TITLE: 'javascript',
  AUTHOR: 'richard',
  PUBLISHER: 'reilly',
  NOTFOUND : 'random'
}

const paginationTestCases = ['NEXT','PREVIOUS','2']

bookStoreTest.beforeEach(async ({searchPage})=>{
  await searchPage.openSearchPage()
});

bookStoreTest.describe('search book by keyword',() => {  
  Object.keys(searchTestCases).forEach(key => {
    bookStoreTest(`user should be able to search books by ${key}`, async ({ searchPage }) => {
      var keyword = searchTestCases[key]
      await searchPage.searchBook(keyword)
      await searchPage.assertBooksAreContainsKeyword(keyword,key);  
    });
  })

  bookStoreTest(`user should be able to limit book's shown`, async ({ searchPage }) => {
    var page = 5
    await searchPage.selectRowOfPage(page)
    await searchPage.assertNumberOfRowList(page)
  })

  paginationTestCases.forEach(testCase => {
    bookStoreTest(`user should be able to navigate the page to page ${testCase}`, async ({ searchPage }) => {

      await searchPage.selectRowOfPage(5)
      if(testCase == `PREVIOUS`){
        searchPage.navigateToPage('2')
      }
      var previousPageData = await searchPage.titleColumn.allInnerTexts()
      await searchPage.navigateToPage(testCase)
      var currentPageData = await searchPage.titleColumn.allInnerTexts()
      await searchPage.assertPageChanged(previousPageData,currentPageData)
    })
  });
  
  bookStoreTest(`user should be able to navigate to login page`, async ({ searchPage, loginPage }) => {
    await searchPage.loginButton.click()
    await loginPage.loginLabel.isVisible()
  })

});