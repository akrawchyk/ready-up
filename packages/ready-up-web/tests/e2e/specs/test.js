// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
const Faker = require('faker')

const displayName = `${Faker.random.words(2)} ${Faker.random.alphaNumeric(4)}`
const password = Faker.internet.password()

const selectors = {
  createUserLink: 'a[href="/users/new"]',
  createUserFormDisplayName: '#usersEdit form input#displayName',
  createUserFormPassword: '#usersEdit form input#password',
  createUserFormSubmit: '#usersEdit form button[type="submit"]',
  loginLink: 'a[href="/login"]',
  loginFormDisplayName: '#login form input#displayName',
  loginFormPassword: '#login form input#password',
  loginFormSubmit: '#login form button[type="submit"]'
}

module.exports = {
  'home': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#home', 5000)
      .assert.elementPresent(selectors.createUserLink)
      .assert.elementPresent(selectors.loginLink)
      .assert.containsText('h1', 'Welcome to Ready Up')
      // .assert.elementCount('img', 1)
      .end()
  },
  'create user': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#home', 5000)
      .click(selectors.createUserLink)
      .waitForElementVisible('#usersEdit', 5000)
      .assert.elementPresent(selectors.createUserFormDisplayName)
      .assert.elementPresent(selectors.createUserFormPassword)
      .assert.elementPresent(selectors.createUserFormSubmit)
      .setValue(selectors.createUserFormDisplayName, displayName)
      .setValue(selectors.createUserFormPassword, password)
      .click(selectors.createUserFormSubmit)
      .end()
  },
  'login': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#home', 5000)
      .click(selectors.loginLink)
      .waitForElementVisible('#login', 5000)
      .assert.elementPresent(selectors.loginFormDisplayName)
      .assert.elementPresent(selectors.loginFormPassword)
      .assert.elementPresent(selectors.loginFormSubmit)
      .setValue(selectors.loginFormDisplayName, displayName)
      .setValue(selectors.loginFormPassword, password)
      .click(selectors.loginFormSubmit)
      .end()
  }
}
