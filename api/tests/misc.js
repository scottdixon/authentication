const request = require('supertest')
const app = require('../server.js')
const User = require('../models/User')
const chai = require('chai')

const should = chai.should()

let token

describe('Misc', () => {
  it('should return a 404 for an invalid URL', (done) => {
    request(app)
      .get('/nothing-to-see-here')
      .expect(404, done)
  })
})
