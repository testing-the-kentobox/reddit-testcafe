import { Selector } from 'testcafe';
import { ClientFunction } from 'testcafe';

fixture `Reddit - Front Page Of The Internet - Login`
    .page `https://www.reddit.com/`
    .beforeEach(async t => {
      await t
        .click(loginButton)
        .switchToIframe(loginIframe)
    });

// Login Elements
// I find it exciting that there isn't native x-path support, that element + .withText() will get the job done.
// since xpath is really only useful for elements with specific text. This streamlines element locating and
// is easier to read. There is NPM package css-to-xpath, but I'll stick with this out of box implementation as hits
// more efficient IMO.
const forgotPasswordLink = Selector('a').withText('Forgot password');
const forgotUsernameLink = Selector('a').withText('Forgot username');
const loginButton = Selector('a').withText('LOG IN');
const loginErrorMessage = Selector('div.AnimatedForm__errorMessage');
const loginIframe = Selector('iframe[src$="/login/"]');
const loginTitle = Selector('div.PageColumns h1.Title');
const newToRedditSignUpLink = Selector('a').withText('SIGN UP');
const passwordInput = Selector('input#loginPassword');
const recoverYourUsernameHeader = Selector('h1.Title').withText('Recover your username');
const resetYourPasswordHeader = Selector('h1.Title').withText('Reset your password');
const submitButton = Selector('button[type="submit"]');
const usernameInput = Selector('input#loginUsername');

// Test Variables
const userName = 'kennythetester';
const password = 'kennytestingthings1';

// Tests
test('login button should navigate to login form', async t => {
    await t
        .expect((loginTitle).innerText).eql('Sign in');
});

test('login to reddit is successful', async t => {
    await t
        .typeText(usernameInput, userName)
        .typeText(passwordInput, password)
        .click(submitButton);
});

test('error message should appear for invalid credentials', async t => {
    await t
        .typeText(usernameInput, userName)
        .typeText(passwordInput, 'WrongPassword')

     await t
        .click(submitButton)
        .expect(loginErrorMessage.withText('Incorrect password').visible).ok()
});

test('username should be between 3 and 20 characters', async t => {
    const errorMessage = 'Username must be between 3 and 20 characters';
    const wrongUsernameLengthLessThan3 = 'ne';
    const wrongUsernameLengthGreaterThan20 = 'wrongusernamelengthgreaterthan20';
     await t
        .typeText(usernameInput, wrongUsernameLengthLessThan3)
        .click(submitButton)
        .expect(loginErrorMessage.withText(errorMessage).visible).ok()
        .typeText(usernameInput, wrongUsernameLengthGreaterThan20)
        .click(submitButton)
        .expect(loginErrorMessage.withText(errorMessage).visible).ok()
});

test('Incorrect username or password', async t => {
    const wrongUsername = 'wrongusernameleng';
    const errorMessage = 'Incorrect username or password'
      await t
        .typeText(usernameInput, wrongUsername)
        .click(submitButton)
        .expect(loginErrorMessage.withText(errorMessage).visible).ok()
});

test('forgot username link is present in login form', async t => {
    await t
        .expect(forgotUsernameLink.visible).eql(true)
        .click(forgotUsernameLink)
        .expect(recoverYourUsernameHeader.visible).ok();
});

test('forgot password link is present in login form', async t => {
    await t
        .expect(forgotPasswordLink.visible).eql(true)
        .click(forgotPasswordLink)
        .expect(resetYourPasswordHeader.visible).ok();
});
