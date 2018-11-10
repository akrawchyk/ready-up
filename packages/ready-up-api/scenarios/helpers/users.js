const Faker = require('faker')

function generateRandomUser(userContext, events, done) {
  const displayName = `${Faker.random.words(2)} ${Faker.random.alphaNumeric(4)}`
  const password = Faker.internet.password()
  userContext.vars.displayName = displayName
  userContext.vars.password = password
  return done()
}

module.exports = {
  generateRandomUser
}
