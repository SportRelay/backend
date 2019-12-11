const { decode } = require('jsonwebtoken')

parseUserId = (jwtToken) => {
  const decodedJwt = decode(jwtToken)
  console.log(decodedJwt);
  return decodedJwt._id
}
getUserId = (event) => {
  const authorization = event.headers.authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  return parseUserId(jwtToken)
}

module.exports = getUserId