const passport = require('passport')
const PassportJwt = require('passport-jwt')
const JWT = require('jsonwebtoken')
const User = require('../models/User')

const jwtSecret = process.env.JWT_SECRET
const jwtAlgorithm = 'HS256'
const jwtExpiresIn = '6h'

passport.use(User.createStrategy())

const register = (req, res, next) => {
  // Make a new user
  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  })

  // Register the user with their specified password
  User.register(user, req.body.password, (error, user) => {
    if (error) {
      // Something went wrong!
      next(error)
      return
    }

    // Add the user info to req.user so we can access
    // it from other middleware
    req.user = user
    next()
  })
}

// Passport processes the JWT for us
passport.use(new PassportJwt.Strategy({
  jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
  algorithms: [jwtAlgorithm]
}, (payload, done) => {
  // Payload is the info from our token
  User.findById(payload.sub)
    .then((user) => {
      if (user) {
        done(null, user)
      } else{
        done(null, false)
      }
    })
    .catch((error) => {
      done(error, false)
    })
}))

// Create a JWT for the user
const signJWTForUser = (req, res) => {
  // Get the user (either just logged in or just signed up)
  const user = req.user

  // Create a signed token
  const token = JWT.sign(
    {
      email: user.email
    },
    jwtSecret,
    {
      subject: user._id.toString(),
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpiresIn
    }
  )

  // Send the JWT to the user!
  res.send({token: token})
}

const verifyAdmin = (req, res, next) => {
  if (req.user.role && req.user.role === 'admin') {
    next()
  } else {
    res.status(401).send({ error: "You have no business here." })
  }
}

module.exports = {
  initialize: passport.initialize(),
  register: register,
  signIn: passport.authenticate('local', { session: false }),
  requireJWT: passport.authenticate('jwt', { session: false }),
  signJWTForUser: signJWTForUser,
  verifyAdmin: verifyAdmin
}
