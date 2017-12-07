const User = require('../models/User')
const JWT = require('jsonwebtoken')

const temporaryUsers = []

const createTemporaryUser = ({ email, password, role}) => {
  return new Promise((resolve, reject) => {
    // Add a first name, last name if non provided
    const user = {
      firstName: 'Jane',
      lastName: 'Doe',
      email
    }

    // Only add role if specified
    if (role) user.role = role

    // Create the user in our database - this will hash the password, etc
    User.register(new User(user), password, (err, newUser) => {
      if (err) {
        reject(err)
        return
      }

      // Keep track of who we create so we can easily delete them
      temporaryUsers.push(newUser)

      // User has been created, generate a JWT
      // Tech debt: DRY
      const token = JWT.sign(
        {
          email: newUser.email
        },
        process.env.JWT_SECRET,
        {
          subject: newUser._id.toString(),
          algorithm: 'HS256',
          expiresIn: '6h'
        })

      // Hand back the token!
      resolve(token)
    })
  })
}

const removeTemporaryUsers = () => {
  temporaryUsers.forEach(async user => {
    await User.remove({ email: user.email })
  })
};

module.exports = { createTemporaryUser, removeTemporaryUsers }
