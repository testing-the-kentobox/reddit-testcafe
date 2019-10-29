import { Selector } from 'testcafe';
import { ClientFunction } from 'testcafe';

fixture `Reddit - Front Page Of The Internet - Search`
    .page `https://www.reddit.com/`
    .beforeEach( async t => {
      const userName = 'kennythetester';
      const password = 'testingitup1';

      await t
        .click(loginButton)
        .switchToIframe(loginIframe)
        .typeText(usernameInput, userName)
        .typeText(passwordInput, password)
        .click(submitButton)
        .switchToMainWindow();
    });

// Search Elements
const articleTitle = Selector('div[data-test-id="post-content"] h1');
const searchBarInput = Selector('input#header-search-bar');
const searchResultErrorMessage = Selector('div').withText('Sorry, there were no community results for');
const searchResultJoinButton = Selector('button').withText('JOIN');
const searchResultTitle = Selector('h3 > span');
const squaredCircleJoinButton = Selector('a[href="/r/SquaredCircle/"] button');
const successfullyJoinedGroup = Selector('span').withText('Sucсessfully joined r/SquaredCircle');
const resultArticle = Selector('a[data-click-id="body"]');

// Login Elements
const loginButton = Selector('a').withText('LOG IN');
const loginIframe = Selector('iframe[src$="/login/"]');
const passwordInput = Selector('input#loginPassword');
const submitButton = Selector('button[type="submit"]');
const usernameInput = Selector('input#loginUsername');

// Tests
test('should be able to search for topic of interest', async t => {
    await t
        .typeText(searchBarInput, 'personal finance')
        .pressKey('enter')
        .expect(searchResultTitle.innerText).eql('personal finance')
        .expect(searchResultJoinButton.count).gte(1);
});

test('should display "no results found" message for search term with no hits', async t => {
    const invalidSearchTerm = 'zyck2uasd';
    const searchResultsNotFoundMessage = `Sorry, there were no community results for "${invalidSearchTerm}"`
    await t
        .typeText(searchBarInput, invalidSearchTerm)
        .pressKey('enter')
        .expect(searchResultTitle.innerText).eql(invalidSearchTerm)
        .expect(searchResultJoinButton.count).lte(1)
});

test('should be able to join a subreddit', async t => {
    await t
        .typeText(searchBarInput, 'squared circle')
        .pressKey('enter')

        // If group is already joined, need to reset the condition and leave the group to then verify
        // joined group successful.
        const groupStatus = Selector('a[href="/r/SquaredCircle/"] button');
        if (await groupStatus.innerText === "JOINED") {
          await t
              .hover(squaredCircleJoinButton)
              .expect(squaredCircleJoinButton.withText('LEAVE').visible).ok()
              .click(squaredCircleJoinButton)
              .expect(squaredCircleJoinButton.withText('JOIN').visible).ok()
              .click(squaredCircleJoinButton)
              .expect(successfullyJoinedGroup.visible).ok();
        } else {
          await t
              .click(squaredCircleJoinButton)
              .expect(successfullyJoinedGroup.visible).ok();
        }
});

test('should be able to select and view first article', async t => {
    await t
        .typeText(searchBarInput, 'personal finance')
        .pressKey('enter')

    const postContentTitle = await resultArticle.innerText;
    await t
        .click(resultArticle)
        .expect(articleTitle.innerText).eql(postContentTitle);
});
