const request = require('supertest')
const app = require('../server.js')
const User = require('../models/User')
const chai = require('chai')

const should = chai.should()

let token

describe('Authentication', () => {

  it('should register a user', (done) => {
    request(app)
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'test@test.com',
        password: 'edison123'
      })
      .expect(200, done)
  })

  it('should log a user in', (done) => {
    request(app)
      .post('/auth')
      .send({
        email: 'test@test.com',
        password: 'edison123'
      })
      .expect(200)
      .then((response) => {
        token = response.body.token
        done()
      })
  })

  it('should require correct credentials', (done) => {
    request(app)
      .post('/auth')
      .send({
        email: 'bloop@bloop.com',
        password: 'edison123'
      })
      .expect(401, done)
  })

  after((done) => {
    User.remove({ email: 'test@test.com' }).then(() => {
      done()
    })
  })

})
