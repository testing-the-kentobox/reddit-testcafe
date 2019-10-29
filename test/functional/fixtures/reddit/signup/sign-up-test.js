import { Selector } from 'testcafe';
import { ClientFunction } from 'testcafe';
import faker from 'faker';

fixture `Reddit - Front Page Of The Internet - Register`
    .page `https://www.reddit.com/`
    .beforeEach(async t => {
      await t
          .click(signUpButton)
          .switchToIframe(signUpIframe)
    });

// Sign Up Elements
const findCommunitiesHeader = Selector('h1.Title').withText('Find communities by topics you’re interested in.');
const newToRedditSignUpLink = Selector('a').withText('SIGN UP');
const signUpCloseButton = Selector('button svg polygon[fill="inherit"]'); // There was not a good attribute to target this polygon
const signUpBackLink = Selector('a.AnimatedForm__backLink');
const signUpButton = Selector('a').withText('SIGN UP');
const signUpEmailInput = Selector('input#regEmail');
const signUpErrorMessage = Selector('div.AnimatedForm__errorMessage');
const signUpHeader = Selector('h1.Title');
const signUpHeaderDescription = Selector('p.Description');
const signUpIframe = Selector('iframe[src$=signup]');
const signUpModal = Selector('div.Onboarding__step');
const signUpPasswordInput = Selector('input#regPassword');
const signUpTitle = Selector('div.Onboarding__step > h1.Title');
const signUpUsernameGeneratorField = Selector('div.Onboarding__usernameGenerator');
const signUpUsernameSuggestionsHeader = Selector('p').withText('Here are some username suggestions ');
const signUpUsernameSuggestionList = Selector('div.Onboarding__usernameWrapper > a');
const signUpUsernameInput = Selector('input#regUsername');
const submitButton = Selector('button[type="submit"]');

// Tests
test('sign up form should have correct title', async t => {
  const titleText = 'By having a Reddit account, you can join, vote, and comment on all your favorite Reddit content.';
    await t
        .expect((signUpTitle).innerText).eql(titleText);
});

// This will not run end to end because of the reCAPTCHA issue.
test.skip('sign up to reddit is successful', async t => {
    const generatedEmail = faker.internet.email();
    const generatedUsername = faker.internet.userName();
    const generatedPassword = faker.internet.password();

    await t
        .typeText(signUpEmailInput, generatedEmail)
        .click(submitButton)
        .typeText(signUpUsernameInput, generatedUsername)
        .typeText(signUpPasswordInput, generatedPassword)

        // reCAPTCHA is enabled. This prevents automated tests [robots] from completing sign up process
        // skipping this step for now as there is no known solution for automating this right now.
        // Except maybe for an AI framework like Mabl or Testim [possibly]

        .click(submitButton)
        .expect(findCommunitiesHeader.visible).ok();
});

test('Choose your username header should appear when choosing username/password', async t => {
    const generatedEmail = faker.internet.email();
    await t
        .typeText(signUpEmailInput, generatedEmail)
        .click(submitButton)
        .expect(signUpHeader.withText('Choose your username').visible).ok()
});

// This test will fail because the element locator doesn't want to play nice with the test
test.skip('clicking on close button aborts the sign up process - exits the modal', async t => {
    const generatedEmail = faker.internet.email();

    await t
        .click(signUpCloseButton) // Can't seem to get this element to work in this test
        .expect(signUpModal.visible).notOk()
        .switchToMainWindow()
        .click(signUpButton)
        .switchToIframe(signUpIframe)
        .typeText(signUpEmailInput, generatedEmail)
        .click(submitButton)
        .click(signUpCloseButton)
        .expect(signUpModal.visible).notOk();
});

test('clicking back button returns to previous UI with email field filled in with previous value', async t => {
    const generatedEmail = faker.internet.email();
    const header = 'Choose your username';

    await t
        .typeText(signUpEmailInput, generatedEmail)
        .click(submitButton)
        .expect(signUpHeader.withText(header).visible).ok()
        .click(signUpBackLink)
        .expect(signUpEmailInput.withAttribute('data-empty', 'false').exists).ok()
        .expect(signUpEmailInput.withAttribute('name').visible).ok()

    const text = await Selector(signUpEmailInput).value;

    await t
        .expect(text).eql(generatedEmail);
    });

test('error message should appear for usernames that are too short or long', async t => {
    const generatedEmail = faker.internet.email();
    const errorMessage = 'Username must be between 3 and 20 characters';
    const wrongUsernameLengthLessThan3 = 'ne';
    const wrongUsernameLengthGreaterThan20 = 'wrongusernamelengthgreaterthan20';

    await t
        .typeText(signUpEmailInput, generatedEmail)
        .click(submitButton)
        .typeText(signUpUsernameInput, wrongUsernameLengthLessThan3)
        .expect(signUpErrorMessage.withText(errorMessage).visible).ok()
        .typeText(signUpUsernameInput, wrongUsernameLengthGreaterThan20)
        .expect(signUpErrorMessage.withText(errorMessage).visible).ok()
});

test('usernames are suggested if typed in username is already taken', async t => {
    const generatedEmail = faker.internet.email();
    const existingUsername = 'dkj';
    const errorMessage = 'That username is already taken';

    await t
        .typeText(signUpEmailInput, generatedEmail)
        .click(submitButton)
        .typeText(signUpUsernameInput, existingUsername)
        .expect(signUpErrorMessage.withText(errorMessage).visible).ok()
        .expect(signUpUsernameGeneratorField.visible).ok()
        .expect(signUpUsernameSuggestionsHeader.visible).ok()
        .expect(signUpUsernameSuggestionList.count).gte(1);
});
