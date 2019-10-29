# Learning Node.js Framework [Testcafe] with Reddit web app

Testcafe is node.js end to end automation framework developed by DevExpress.

Example of work - found in these paths:

test/functional/fixtures/reddit

reddit/login-test.js

reddit/register-test.js

reddit/search-test.js

This was my first time using testcafe for test automation. A few months ago, I experimented with Cypress.io
This time, its Testcafe's time.

## General Notes
I found the testcafe framework to be very pleasant to develop on. Its fast, has intelligent waiting for page
loads so time syncing is no longer an issue, and has easier syntax to understand and use. One of the main benefits
is that I can find locators I normally would use xpaths for with the .withText('<text looking for in here>'). As a
test creator, I really appreciate this alot.

## Set Up

Clone the repository.  
Navigate to this project directory in your terminal.  
Install the NPM dependencies.  

```sh
npm install
```

To run tests, copy and paste this into terminal

```sh
testcafe chrome test/functional/fixtures/reddit/signup/register-test.js

or

testcafe chrome test/functional/fixtures/reddit/login/login-test.js

or

testcafe chrome test/functional/fixtures/reddit/search/search-test.js
```

## Resources
https://devexpress.github.io/testcafe/

https://github.com/DevExpress/testcafe
