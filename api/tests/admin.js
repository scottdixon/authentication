const request = require('supertest')
const app = require('../server.js')
const chai = require('chai')
const { createTemporaryUser, removeTemporaryUsers } = require('./helpers')

const should = chai.should()

let userToken, adminToken

describe('Admin', () => {

  before(async () => {
    // We need to test roles, create a user and an admin
    userToken = await createTemporaryUser({
      email: 'user@t.com', password: 'pass'
    })

    adminToken = await createTemporaryUser({
      email: 'admin@t.com', password: 'admin', role: 'admin'
    })
  })

  it('Should allow admin to view /admin', (done) => {
    request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200, done)
  })

  it('Should not allow non-admin to view /admin', (done) => {
    request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(401, done)
  })

  after(async () => {
    await removeTemporaryUsers()
  })
})
