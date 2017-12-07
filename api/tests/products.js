const request = require('supertest')
const app = require('../server.js')
const chai = require('chai')
const { createTemporaryUser, removeTemporaryUsers } = require('./helpers')

const should = chai.should()

let userToken, adminToken

describe('Products', () => {

  before(async () => {
    // We need to test roles, create a user and an admin
    userToken = await createTemporaryUser({
      email: 'user@t.com', password: 'pass'
    })

    adminToken = await createTemporaryUser({
      email: 'admin@t.com', password: 'admin', role: 'admin'
    })
  })

  it('Should block access without a token', (done) => {
    request(app)
      .get('/products')
      .expect(401, done)
  })

  it('Should allow access with a token', (done) => {
    request(app)
      .get('/products')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200, done)
  })

  after(async () => {
    await removeTemporaryUsers()
  })
})
